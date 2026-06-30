"use client";

import { Button, Upload } from "@dnb/eufemia";

import { ComponentDemoBox } from "./ComponentDemoBox";
import { ComponentDocsPage } from "./ComponentDocsPage";
import { PropertiesTable, type PropertyRow } from "./PropertiesTable";

export function UploadDocs() {
  return (
    <ComponentDocsPage
      title="Upload"
      description="Use Upload when people need to drag and drop, select, validate, and review files before submission."
      tabs={[
        { id: "info", label: "Info", content: <UploadInfo /> },
        { id: "demos", label: "Demos", content: <UploadDemos /> },
        { id: "properties", label: "Properties", content: <UploadProperties /> },
      ]}
    />
  );
}

function UploadInfo() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="mdx-h2">Import</h2>
        <pre className="border-border bg-panel overflow-auto border p-4 text-sm">
          <code>{`import { Upload } from "@dnb/eufemia"`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="mdx-h2">Description</h2>
        <p className="text-muted-foreground max-w-3xl leading-7">
          Upload provides a drop zone and file picker for one or more files. Keep accepted file
          types, file limits and file-size rules visible near the action so the user can understand
          validation before selecting files.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="mdx-h2">Recommended usage</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm leading-6">
          <li>Use explicit accepted file types, such as JPG and PNG for image-only uploads.</li>
          <li>
            Use <code>filesAmountLimit</code> when the flow expects an exact or maximum count.
          </li>
          <li>
            Use stable IDs when you want to inspect selected files with{" "}
            <code>Upload.useUpload</code>.
          </li>
          <li>Keep upload messages short. Put advanced validation details below the field.</li>
        </ul>
      </section>
    </div>
  );
}

function UploadDemos() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h2 className="mdx-h2">Demos</h2>
        <p className="text-muted-foreground max-w-3xl text-sm leading-6">
          These examples mirror the Eufemia demo-box behaviour: preview first, light-mode switch and
          toolbar controls, then code.
        </p>
      </header>

      <section className="space-y-4">
        <h3 className="text-foreground text-lg font-semibold">
          Upload single file/fixed amount of files
        </h3>
        <ComponentDemoBox
          id="UploadSingleFile"
          title="Upload single file/fixed amount of files"
          code={uploadSingleFileCode}
          minHeight="14rem"
          defaultLightMode
        >
          <UploadSingleFile />
        </ComponentDemoBox>
      </section>

      <section className="space-y-4">
        <h3 className="text-foreground text-lg font-semibold">Upload multiple files</h3>
        <ComponentDemoBox
          id="UploadMultipleFiles"
          title="Upload multiple files"
          code={uploadMultipleFilesCode}
          minHeight="14rem"
          defaultLightMode
        >
          <UploadMultipleFiles />
        </ComponentDemoBox>
      </section>

      <section className="space-y-4">
        <h3 className="text-foreground text-lg font-semibold">Upload with helper action</h3>
        <p className="text-muted-foreground max-w-3xl text-sm leading-6">
          A small companion action can be used when users may need a template, rule document, or
          upload instructions.
        </p>
        <ComponentDemoBox
          id="UploadWithHelperAction"
          title="Upload with helper action"
          code={uploadWithHelperActionCode}
          minHeight="14rem"
          defaultLightMode
        >
          <UploadWithHelperAction />
        </ComponentDemoBox>
      </section>
    </div>
  );
}

function UploadProperties() {
  return (
    <section className="space-y-4">
      <h2 className="mdx-h2">Properties</h2>
      <PropertiesTable rows={uploadPropertyRows} />
    </section>
  );
}

function UploadSingleFile() {
  const { files } = Upload.useUpload("upload-single-file");

  if (files.length) {
    console.log("files", files);
  }

  return <Upload acceptedFileTypes={["jpg", "png"]} id="upload-single-file" filesAmountLimit={1} />;
}

function UploadMultipleFiles() {
  return (
    <Upload
      acceptedFileTypes={["jpg", "png", "pdf"]}
      id="upload-multiple-files"
      filesAmountLimit={5}
    />
  );
}

function UploadWithHelperAction() {
  return (
    <div className="space-y-4">
      <Upload
        acceptedFileTypes={["jpg", "png"]}
        id="upload-with-helper-action"
        filesAmountLimit={1}
      />
      <Button variant="tertiary" icon="download" text="Last ned opplastingsmal" />
    </div>
  );
}

const uploadSingleFileCode = String.raw`
const Component = () => {
  const { files } = Upload.useUpload("upload-single-file")

  if (files.length) {
    console.log("files", files)
  }

  return (
    <Upload
      acceptedFileTypes={["jpg", "png"]}
      id="upload-single-file"
      filesAmountLimit={1}
    />
  )
}

render(<Component />)
`;

const uploadMultipleFilesCode = String.raw`
<Upload
  acceptedFileTypes={["jpg", "png", "pdf"]}
  id="upload-multiple-files"
  filesAmountLimit={5}
/>
`;

const uploadWithHelperActionCode = String.raw`
<div className="space-y-4">
  <Upload
    acceptedFileTypes={["jpg", "png"]}
    id="upload-with-helper-action"
    filesAmountLimit={1}
  />
  <Button
    variant="tertiary"
    icon="download"
    text="Last ned opplastingsmal"
  />
</div>
`;

const uploadPropertyRows: PropertyRow[] = [
  {
    name: "id",
    type: "string",
    status: "required",
    description:
      "Stable identifier for the upload instance. Use it with Upload.useUpload when selected files need to be inspected.",
  },
  {
    name: "acceptedFileTypes",
    type: "string[]",
    description: "Allowed file types, for example jpg, png or pdf.",
  },
  {
    name: "filesAmountLimit",
    type: "number",
    description: "Maximum amount of files accepted by this upload instance.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Disables the upload interaction.",
  },
  {
    name: "status",
    type: "string | React.ReactNode",
    description: "Validation or status message connected to the upload field.",
  },
  {
    name: "onChange",
    type: "function",
    description: "Called when files are selected, changed or removed.",
  },
];
