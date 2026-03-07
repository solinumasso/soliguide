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
