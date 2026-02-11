/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  ApiPlace,
  DocExportRow,
  DocExportSection,
  CategoriesService,
  SortingFilters,
} from "@soliguide/common";

import { format } from "date-fns";
import Docxtemplater from "docxtemplater";
import { pathExists, readFile } from "fs-extra";
import i18next from "i18next";
import libre from "libreoffice-convert";
import { join } from "node:path";
import PizZip from "pizzip";
import { promisify } from "util";

import { ExportSearchParams } from "../../interfaces";
import { renderExportRows } from "./renderExportRows";
import { UpComingTempInfo } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageModule = require("docxtemplater-image-module-free");

export const printDocWord = async (
  frontUrl: string,
  categoriesService: CategoriesService,
  places: ApiPlace[],
  searchData: ExportSearchParams,
  upcomingTempInfo: UpComingTempInfo
): Promise<Buffer> => {
  const exportParams = searchData.exportParams;

  const res: {
    lastUpdateDate?: string;
    generationDate?: string;
    headerMessage: string;
    headerWarning: string;
    footerWarning: string;
    footerFlashMe: string;
    servicesTitle: string;
    sections: DocExportSection[];
  } = {
    headerMessage: i18next.t("EXPORTS_WORD_HEADER", {
      lng: exportParams.language,
    }),
    headerWarning: i18next.t("EXPORTS_WORD_WARNING_HEADER", {
      lng: exportParams.language,
    }),
    footerWarning: i18next.t("EXPORTS_WORD_FOOTER_MESSAGE", {
      lng: exportParams.language,
    }),
    footerFlashMe: i18next.t("EXPORTS_WORD_FOOTER_FLASH_ME", {
      lng: exportParams.language,
    }),
    servicesTitle: i18next.t("EXPORTS_HEADER_SERVICES", {
      lng: exportParams.language,
    }),
    generationDate:
      i18next.t("EXPORTS_PUBLISHING_DATE", {
        lng: exportParams.language,
      }) || "EXPORTS_PUBLISHING_DATE",
    lastUpdateDate: format(new Date(), "dd/MM/yyyy"),
    sections: await generateWordSections(
      frontUrl,
      categoriesService,
      places,
      searchData,
      upcomingTempInfo
    ),
  };

  // Load the docx file as binary content
  const templateFileName =
    exportParams.sortingFilter === SortingFilters.SERVICE
      ? "_TEMPLATE_SERVICES_NO_STYLE.docx"
      : "_TEMPLATE_STRUCTURE_NO_STYLE.docx";

  const templatePath = join(
    __dirname,
    "../../../../resources/auto-export/templates/",
    templateFileName
  );

  const content = await readFile(templatePath, { encoding: "binary" });

  const zip = new PizZip(content);

  const imageOpts = {
    fileType: "docx",
    // NB: if image empty, the "empty" tagValue must be set "en amont"
    getImage: async (tagValue: string) => {
      return await readFile(tagValue);
    },
    getSize: () => {
      return [25, 25];
    },
  };
  // to fix problems of corrupted file if adding images inside a loop:
  // see: https://docxtemplater.com/docs/faq
  const fixDocPrCorruptionModule = {
    on(event: string) {
      if (event === "attached") {
        this.attached = false;
      }

      if (event !== "syncing-zip") {
        return;
      }

      const zip: PizZip = this.zip;
      const Lexer = this.Lexer;

      let prId = 1;

      const setSingleAttribute = (
        partValue: string,
        attr: string,
        attrValue: string | number
      ) => {
        const regex = new RegExp(`(<.* ${attr}=")([^"]+)(".*)$`);

        if (regex.test(partValue)) {
          return partValue.replace(regex, `$1${attrValue}$3`);
        }

        let end = partValue.lastIndexOf("/>");

        if (end === -1) {
          end = partValue.lastIndexOf(">");
        }

        return (
          partValue.substring(0, end) +
          ` ${attr}="${attrValue}"` +
          partValue.substring(end)
        );
      };
      zip.file(/\.xml$/).forEach((f: PizZip.ZipObject) => {
        let text = f.asText();

        const xmllexed = Lexer.xmlparse(text, {
          other: ["wp:docPr"],
          text: [],
        });

        if (xmllexed.length > 1) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text = xmllexed.reduce((fullText: string, part: any) => {
            if (
              part.tag === "wp:docPr" &&
              ["start", "selfclosing"].indexOf(part.position) !== -1
            ) {
              return fullText + setSingleAttribute(part.value, "id", prId++);
            }
            return fullText + part.value;
          }, "");
        }
        zip.file(f.name, text);
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(options: any) {
      if (options.Lexer) {
        this.Lexer = options.Lexer;
      }
      if (options.zip) {
        this.zip = options.zip;
      }
    },
  };

  const doc = new Docxtemplater(zip, {
    linebreaks: true,
    modules: [new ImageModule(imageOpts), fixDocPrCorruptionModule],
    paragraphLoop: true,
  });

  await doc.renderAsync(res);

  const docxBuf = doc.getZip().generate({ type: "nodebuffer" });

  if (exportParams.fileType === "PDF") {
    return await promisify(libre.convert)(docxBuf, "pdf", undefined);
  }

  return docxBuf;
};

export const generateWordSections = async (
  frontUrl: string,
  categoriesService: CategoriesService,
  places: ApiPlace[],
  searchData: ExportSearchParams,
  upcomingTempInfo: UpComingTempInfo
): Promise<DocExportSection[]> => {
  const exportParams = searchData.exportParams;
  const { rows, columnsToDelete } = renderExportRows(
    frontUrl,
    categoriesService,
    places,
    searchData,
    upcomingTempInfo
  );

  const sections: { [key: string]: DocExportSection } = {};

  let lastSectionId: string | null = null;

  for await (const row of rows) {
    const currentValue = row.sectionName ?? "";

    const sectionImage =
      exportParams.sortingFilter === SortingFilters.SERVICE && row.category
        ? await getImage(row.category?.toString())
        : "";

    const doc: DocExportSection = {
      sectionName: currentValue,
      sectionImage,
      docRows: [],
    };

    if (!lastSectionId || lastSectionId !== currentValue) {
      lastSectionId = currentValue;
      sections[currentValue] = doc;
    }

    sections[currentValue].docRows.push(row);
  }

  // Convert object as array for docxtemplater
  const sectionsArray: DocExportSection[] = [];
  Object.keys(sections).forEach((currentSection: string) => {
    // We generate the numbers of each structure displayed in the document
    let rowId = 1;
    sections[currentSection].docRows.forEach((row) => {
      // Delete unwanted columns and create JSON object
      columnsToDelete.forEach((element: keyof DocExportRow) => {
        delete row[element];
      });

      row.rowId = rowId;
      rowId++;
    });

    sectionsArray.push(sections[currentSection]);
  });

  return sectionsArray;
};

export const getImage = async (category: string | number): Promise<string> => {
  const picto = join(
    __dirname,
    "../../../../resources/auto-export/pictos/",
    category.toString() + ".png"
  );

  const emptyPicto = join(
    __dirname,
    "../../../../resources/auto-export/pictos/empty.png"
  );
  return (await pathExists(picto)) ? picto : emptyPicto;
};
