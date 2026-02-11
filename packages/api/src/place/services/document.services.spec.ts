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
import mongoose from "mongoose";

import documentService from "./document.services";

import { CommonPlaceDocument } from "@soliguide/common";

afterAll(() => {
  mongoose.connection.close();
});
describe("CRUD for documents", () => {
  const fakeDoc = new CommonPlaceDocument({
    serviceId: null,
    encoding: "7bit",
    filename: "fake-doc.pdf",
    lieu_id: 0,
    mimetype: "application/pdf",
    name: "Fake doc",
    path: "fake/path/fake-doc.pdf",
    size: 173181,
  });

  let fakeDocObjectId: string;
  let fakeDocImported: CommonPlaceDocument;

  it("Must create a document", async () => {
    fakeDocImported = await documentService.createDocument(fakeDoc);
    expect(fakeDocImported._id).not.toBeNull();
    fakeDocObjectId = fakeDocImported._id as unknown as string;
  });

  it("Must delete a document", async () => {
    const result = await documentService.deleteDocument(fakeDocObjectId);
    expect(fakeDocObjectId).toEqual(result?._id);
  });
});
