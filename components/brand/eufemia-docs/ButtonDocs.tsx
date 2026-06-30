"use client";

import type { MouseEvent, ReactNode } from "react";
import { Button, Section } from "@dnb/eufemia";

import { ComponentDemoBox } from "./ComponentDemoBox";
import { ComponentDocsPage } from "./ComponentDocsPage";
import { PropertiesTable, type PropertyRow } from "./PropertiesTable";

export function ButtonDocs() {
  return (
    <ComponentDocsPage
      title="Button"
      description="Use Button when people need to start, confirm, submit, or trigger an action. This page mirrors the Eufemia documentation pattern with Info, Demos, Properties and Events tabs."
      tabs={[
        { id: "info", label: "Info", content: <ButtonInfo /> },
        { id: "demos", label: "Demos", content: <ButtonDemos /> },
        { id: "properties", label: "Properties", content: <ButtonProperties /> },
        { id: "events", label: "Events", content: <ButtonEvents /> },
      ]}
    />
  );
}

function ButtonInfo() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="mdx-h2">Import</h2>
        <pre className="border-border bg-panel overflow-auto border p-4 text-sm">
          <code>{`import { Button } from "@dnb/eufemia"`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="mdx-h2">Description</h2>
        <p className="text-muted-foreground max-w-3xl leading-7">
          Button is the primary action primitive for confirmations, submissions and deliberate user
          interaction. Keep primary actions scarce: one primary action per context is usually
          enough. Use secondary and tertiary variants for supporting actions, and use links when
          navigation is the real intent.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="mdx-h2">Variants and sizes</h2>

        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold">Primary button sizes</h3>
          <p className="text-muted-foreground max-w-3xl text-sm leading-6">
            For primary actions, prefer the default and large sizes.
          </p>
          <ComponentDemoBox
            id="PrimaryButtonSizes"
            title="Primary button sizes"
            code={primaryButtonSizesCode}
          >
            <PrimaryButtonSizes />
          </ComponentDemoBox>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold">Secondary button sizes</h3>
          <p className="text-muted-foreground max-w-3xl text-sm leading-6">
            Secondary actions support the same recommended sizes as primary actions.
          </p>
          <ComponentDemoBox
            id="SecondaryButtonSizes"
            title="Secondary button sizes"
            code={secondaryButtonSizesCode}
          >
            <SecondaryButtonSizes />
          </ComponentDemoBox>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold">Tertiary button sizes</h3>
          <p className="text-muted-foreground max-w-3xl text-sm leading-6">
            Tertiary buttons should normally be paired with an icon. For text-only navigation, use a
            link component instead.
          </p>
          <ComponentDemoBox
            id="TertiaryButtonSizes"
            title="Tertiary button sizes"
            code={tertiaryButtonSizesCode}
          >
            <TertiaryButtonSizes />
          </ComponentDemoBox>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold">Icon button sizes</h3>
          <p className="text-muted-foreground max-w-3xl text-sm leading-6">
            Icon-only buttons need a descriptive title or aria-label.
          </p>
          <ComponentDemoBox
            id="IconButtonSizes"
            title="Icon button sizes"
            code={iconButtonSizesCode}
          >
            <IconButtonSizes />
          </ComponentDemoBox>
        </div>
      </section>
    </div>
  );
}

function ButtonDemos() {
  const demos = [
    {
      id: "ButtonPrimary",
      title: "Primary button",
      description: null,
      code: buttonPrimaryCode,
      component: <ButtonPrimary />,
    },
    {
      id: "ButtonSecondary",
      title: "Secondary button",
      description: null,
      code: buttonSecondaryCode,
      component: <ButtonSecondary />,
    },
    {
      id: "ButtonPrimaryWithIcon",
      title: "Primary button with icon",
      description: null,
      code: buttonPrimaryWithIconCode,
      component: <ButtonPrimaryWithIcon />,
    },
    {
      id: "ButtonPrimaryWithIconLeft",
      title: "Primary button with icon on left",
      description: null,
      code: buttonPrimaryWithIconLeftCode,
      component: <ButtonPrimaryWithIconLeft />,
    },
    {
      id: "ButtonTertiary",
      title: "Tertiary button",
      description:
        "The tertiary variant supports multiline text. Use wrap when long text should line-break instead of overflowing.",
      code: buttonTertiaryCode,
      component: <ButtonTertiary />,
    },
    {
      id: "ButtonTertiaryTop",
      title: "Tertiary button with top icon",
      description: null,
      code: buttonTertiaryTopCode,
      component: <ButtonTertiaryTop />,
    },
    {
      id: "ButtonTertiaryWrap",
      title: "Tertiary button with wrap",
      description: null,
      code: buttonTertiaryWrapCode,
      component: <ButtonTertiaryWrap />,
    },
    {
      id: "ButtonAnchor",
      title: "Anchor button",
      description: null,
      code: buttonAnchorCode,
      component: <ButtonAnchor />,
    },
    {
      id: "ButtonDisabled",
      title: "Disabled buttons",
      description:
        "Avoid disabled buttons when possible, because they rarely explain why an action is unavailable.",
      code: buttonDisabledCode,
      component: <ButtonDisabled />,
    },
    {
      id: "ButtonIcon",
      title: "Icon button",
      description:
        "When the button has no visible text, provide title or aria-label so the action is accessible.",
      code: buttonIconCode,
      component: <ButtonIcon />,
    },
    {
      id: "ButtonCustomContent",
      title: "Custom button content",
      description:
        "Use this sparingly. Custom content means you are responsible for alignment and semantics.",
      code: buttonCustomContentCode,
      component: <ButtonCustomContent />,
    },
    {
      id: "ButtonOnDarkSurface",
      title: "Button on dark surface",
      description:
        'Use Section surface="dark" or Theme.Context surface="dark" to make supporting Eufemia components adapt to dark backgrounds.',
      code: buttonOnDarkSurfaceCode,
      component: <ButtonOnDarkSurface />,
      minHeight: "14rem",
      defaultLightMode: false,
    },
    {
      id: "SvgInButton",
      title: "Button with custom SVG",
      description: "Ensure custom SVG content has an accessible label when it carries meaning.",
      code: svgInButtonCode,
      component: <SvgInButton />,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h2 className="mdx-h2">Demos</h2>
        <p className="text-muted-foreground max-w-3xl text-sm leading-6">
          Each demo follows the same preview/toolbar/code pattern as the Eufemia portal: visual
          preview first, light-mode switch and code actions in the toolbar, then the source snippet
          below.
        </p>
      </header>

      {demos.map((demo) => (
        <section key={demo.id} className="space-y-4">
          <h3 className="text-foreground text-lg font-semibold">{demo.title}</h3>
          {demo.description ? (
            <p className="text-muted-foreground max-w-3xl text-sm leading-6">{demo.description}</p>
          ) : null}
          <ComponentDemoBox
            id={demo.id}
            title={demo.title}
            code={demo.code}
            minHeight={demo.minHeight}
            defaultLightMode={demo.defaultLightMode}
          >
            {demo.component}
          </ComponentDemoBox>
        </section>
      ))}
    </div>
  );
}

function ButtonProperties() {
  return (
    <section className="space-y-4">
      <h2 className="mdx-h2">Properties</h2>
      <PropertiesTable rows={buttonPropertyRows} />

      <div className="border-border bg-panel-muted border px-4 py-4 text-sm leading-6">
        <h3 className="text-foreground font-semibold">Unstyled variant</h3>
        <p className="text-muted-foreground mt-1">
          Use <code>variant=&quot;unstyled&quot;</code> only for special cases where the button
          semantics are needed but the visual expression must be fully custom.
        </p>
      </div>
    </section>
  );
}

function ButtonEvents() {
  return (
    <section className="space-y-4">
      <h2 className="mdx-h2">Events</h2>
      <PropertiesTable rows={buttonEventRows} />
    </section>
  );
}

function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function PrimaryButtonSizes() {
  return (
    <ButtonRow>
      <Button text="Default button" onClick={() => console.log("onClick")} />
      <Button text="Large button" size="large" onClick={() => console.log("onClick")} />
      <Button
        text="Default button icon"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
      <Button
        text="Large button icon"
        size="large"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
    </ButtonRow>
  );
}

function SecondaryButtonSizes() {
  return (
    <ButtonRow>
      <Button variant="secondary" text="Default button" onClick={() => console.log("onClick")} />
      <Button
        variant="secondary"
        text="Large button"
        size="large"
        onClick={() => console.log("onClick")}
      />
      <Button
        variant="secondary"
        text="Default button icon"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
      <Button
        variant="secondary"
        text="Large button icon"
        size="large"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
    </ButtonRow>
  );
}

function TertiaryButtonSizes() {
  return (
    <ButtonRow>
      <Button
        variant="tertiary"
        text="Default button"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
      <Button
        variant="tertiary"
        text="Button large"
        size="large"
        icon="chevron_right"
        onClick={() => console.log("onClick")}
      />
      <Button
        variant="tertiary"
        text="Button text"
        icon="bell"
        iconPosition="top"
        onClick={() => console.log("onClick")}
      />
    </ButtonRow>
  );
}

function IconButtonSizes() {
  return (
    <ButtonRow>
      <Button title="Small sized button with add icon" icon="add" size="small" />
      <Button title="Medium sized button with add icon" icon="add" size="medium" />
      <Button title="Default sized button with add icon" icon="add" size="default" />
      <Button title="Large sized button with add icon" icon="add" size="large" />
    </ButtonRow>
  );
}

function ButtonPrimary() {
  return <Button text="Primary button with text only" onClick={() => console.log("onClick")} />;
}

function ButtonSecondary() {
  return (
    <Button variant="secondary" onClick={() => console.log("onClick")}>
      Secondary button with text only
    </Button>
  );
}

function ButtonPrimaryWithIcon() {
  return <Button text="Primary button with icon" icon="chevron_right" />;
}

function ButtonPrimaryWithIconLeft() {
  return (
    <Button iconPosition="left" icon="chevron_left">
      Primary button with icon on left
    </Button>
  );
}

function ButtonTertiary() {
  return (
    <ButtonRow>
      <Button
        variant="tertiary"
        text="Tertiary button with icon on left"
        iconPosition="left"
        icon="chevron_left"
      />
      <Button
        variant="tertiary"
        text={<span>Text inside additional span</span>}
        iconPosition="left"
        icon="chevron_left"
      />
    </ButtonRow>
  );
}

function ButtonTertiaryTop() {
  return (
    <ButtonRow>
      <Button variant="tertiary" iconPosition="top" icon="close" text="Button text" />
      <Button variant="tertiary" iconPosition="top" icon="close" text="Large button" size="large" />
    </ButtonRow>
  );
}

function ButtonTertiaryWrap() {
  return (
    <div className="max-w-xl">
      <Button
        wrap
        variant="tertiary"
        text="A long text where wrap is enabled magnis rutrum netus neque ridiculus euismod sit dictum laoreet libero"
        icon="chevron_left"
        iconPosition="left"
      />
    </div>
  );
}

function ButtonAnchor() {
  return (
    <ButtonRow>
      <Button
        text="Primary with href"
        href="/eufemia/button"
        iconPosition="right"
        icon="chevron_right"
        onClick={({ event }: { event: MouseEvent<HTMLButtonElement | HTMLAnchorElement> }) =>
          event.preventDefault()
        }
      />
      <Button
        variant="secondary"
        text="Secondary with href"
        href="/eufemia/button"
        target="_blank"
      />
      <Button href="/eufemia/button" title="This is a link" icon="chevron_right" size="default" />
    </ButtonRow>
  );
}

function ButtonDisabled() {
  return (
    <ButtonRow>
      <Button text="Disabled primary button" disabled />
      <Button text="Disabled secondary button" variant="secondary" disabled />
      <Button text="Disabled tertiary button" variant="tertiary" disabled />
      <Button title="Disabled Icon Button" icon="calendar" disabled />
      <Button text="Disabled button with href" href="/eufemia/button" target="_blank" disabled />
    </ButtonRow>
  );
}

function ButtonIcon() {
  return (
    <ButtonRow>
      <Button title="Disabled Icon only Button" icon="calendar" disabled />
      <Button title="Button with Icon only" icon="calendar" />
      <Button title="Small sized icon button" icon="add" size="small" />
      <Button title="Large sized icon button" icon="question" size="large" />
      <Button title="Icon button with status" icon="question" status="error" />
      <Button title="Tertiary icon button" size="large" icon="question" variant="tertiary" />
    </ButtonRow>
  );
}

function ButtonCustomContent() {
  return (
    <Button
      icon="close"
      iconPosition="right"
      text="Button with custom content"
      customContent={<span aria-hidden="true">✓</span>}
    />
  );
}

function ButtonOnDarkSurface() {
  return (
    <Section innerSpace={{ block: true }} surface="dark">
      <Button>Primary button</Button>
      <Button variant="secondary" right>
        Secondary button
      </Button>
      <Button variant="tertiary" iconPosition="left" icon="chevron_left" right>
        Tertiary button
      </Button>
      <Button variant="tertiary" icon="bell" />
    </Section>
  );
}

function SvgInButton() {
  return (
    <Button variant="secondary">
      Button with SVG <DemoSvg />
    </Button>
  );
}

function DemoSvg() {
  return (
    <svg aria-label="Demo symbol" width="24" height="24" viewBox="0 0 24 24" role="img">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.18" />
      <path
        d="M7 12.5 10.3 16 17 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const primaryButtonSizesCode = String.raw`
<Button text="Default button" onClick={() => console.log("onClick")} />
<Button text="Large button" size="large" onClick={() => console.log("onClick")} />
<Button text="Default button icon" icon="chevron_right" onClick={() => console.log("onClick")} />
<Button text="Large button icon" size="large" icon="chevron_right" onClick={() => console.log("onClick")} />
`;

const secondaryButtonSizesCode = String.raw`
<Button variant="secondary" text="Default button" onClick={() => console.log("onClick")} />
<Button variant="secondary" text="Large button" size="large" onClick={() => console.log("onClick")} />
<Button variant="secondary" text="Default button icon" icon="chevron_right" onClick={() => console.log("onClick")} />
<Button variant="secondary" text="Large button icon" size="large" icon="chevron_right" onClick={() => console.log("onClick")} />
`;

const tertiaryButtonSizesCode = String.raw`
<Button variant="tertiary" text="Default button" icon="chevron_right" />
<Button variant="tertiary" text="Button large" size="large" icon="chevron_right" />
<Button variant="tertiary" text="Button text" icon="bell" iconPosition="top" />
`;

const iconButtonSizesCode = String.raw`
<Button title="Small sized button with add icon" icon="add" size="small" />
<Button title="Medium sized button with add icon" icon="add" size="medium" />
<Button title="Default sized button with add icon" icon="add" size="default" />
<Button title="Large sized button with add icon" icon="add" size="large" />
`;

const buttonPrimaryCode = String.raw`
<Button
  text="Primary button with text only"
  onClick={() => {
    console.log("onClick")
  }}
/>
`;

const buttonSecondaryCode = String.raw`
<Button
  variant="secondary"
  onClick={() => {
    console.log("onClick")
  }}
>
  Secondary button with text only
</Button>
`;

const buttonPrimaryWithIconCode = String.raw`
<Button text="Primary button with icon" icon="chevron_right" />
`;

const buttonPrimaryWithIconLeftCode = String.raw`
<Button iconPosition="left" icon="chevron_left">
  Primary button with icon on left
</Button>
`;

const buttonTertiaryCode = String.raw`
<Button
  variant="tertiary"
  text="Tertiary button with icon on left"
  iconPosition="left"
  icon="chevron_left"
/>
<Button
  variant="tertiary"
  text={<span>Text inside additional span</span>}
  iconPosition="left"
  icon="chevron_left"
/>
`;

const buttonTertiaryTopCode = String.raw`
<Button
  variant="tertiary"
  iconPosition="top"
  icon="close"
  text="Button text"
/>
<Button
  variant="tertiary"
  iconPosition="top"
  icon="close"
  text="Large button"
  size="large"
/>
`;

const buttonTertiaryWrapCode = String.raw`
<Button
  wrap
  variant="tertiary"
  text="A long text where wrap is enabled magnis rutrum netus neque ridiculus euismod sit dictum laoreet libero"
  icon="chevron_left"
  iconPosition="left"
/>
`;

const buttonAnchorCode = String.raw`
<Button
  text="Primary with href"
  href="/eufemia/button"
  iconPosition="right"
  icon="chevron_right"
  onClick={({ event }) => event.preventDefault()}
/>
<Button
  variant="secondary"
  text="Secondary with href"
  href="/eufemia/button"
  target="_blank"
/>
<Button
  href="/eufemia/button"
  title="This is a link"
  icon="chevron_right"
  size="default"
/>
`;

const buttonDisabledCode = String.raw`
<Button text="Disabled primary button" disabled />
<Button text="Disabled secondary button" variant="secondary" disabled />
<Button text="Disabled tertiary button" variant="tertiary" disabled />
<Button title="Disabled Icon Button" icon="calendar" disabled />
<Button text="Disabled button with href" href="/eufemia/button" target="_blank" disabled />
`;

const buttonIconCode = String.raw`
<Button title="Disabled Icon only Button" icon="calendar" disabled />
<Button title="Button with Icon only" icon="calendar" />
<Button title="Small sized icon button" icon="add" size="small" />
<Button title="Large sized icon button" icon="question" size="large" />
<Button title="Icon button with status" icon="question" status="error" />
<Button title="Tertiary icon button" size="large" icon="question" variant="tertiary" />
`;

const buttonCustomContentCode = String.raw`
<Button
  icon="close"
  iconPosition="right"
  text="Button with custom content"
  customContent={<span aria-hidden="true">✓</span>}
/>
`;

const buttonOnDarkSurfaceCode = String.raw`
<Section innerSpace={{ block: true }} surface="dark">
  <Button>Primary button</Button>
  <Button variant="secondary" right>
    Secondary button
  </Button>
  <Button variant="tertiary" iconPosition="left" icon="chevron_left" right>
    Tertiary button
  </Button>
  <Button variant="tertiary" icon="bell" />
</Section>
`;

const svgInButtonCode = String.raw`
<Button variant="secondary">
  Button with SVG <DemoSvg />
</Button>
`;

const buttonPropertyRows: PropertyRow[] = [
  {
    name: "type",
    type: '"button" | "reset" | "submit"',
    description:
      "The native HTML button type. Defaults to button to prevent accidental form submissions.",
  },
  {
    name: "text",
    type: "string | React.ReactNode",
    description: "The button label. You can also pass children instead.",
  },
  {
    name: "aria-label",
    type: "string",
    description:
      "Required when there is no visible text. A title can be used for icon-only buttons.",
  },
  {
    name: "title",
    type: "string",
    description:
      "Recommended for icon-only buttons. Eufemia can use it as the accessible label when text and children are absent.",
  },
  {
    name: "variant",
    type: '"primary" | "secondary" | "tertiary" | "unstyled"',
    description:
      "Controls the visual hierarchy. Use only one primary action in the same decision context.",
  },
  {
    name: "size",
    type: '"default" | "small" | "medium" | "large"',
    description: "Controls spacing and scale. Tertiary is normally default or large.",
  },
  {
    name: "icon",
    type: "string | React.ReactNode | false",
    description: "Adds an icon. Eufemia primary icon names can be passed as strings.",
  },
  {
    name: "iconPosition",
    type: '"left" | "right" | "top"',
    description: "Controls icon placement. Tertiary also supports top alignment.",
  },
  {
    name: "iconSize",
    type: "string",
    description: "Overrides the icon width and height. Defaults to the component icon size.",
  },
  {
    name: "selected",
    type: "boolean",
    description: "Applies selected styling, mainly relevant for icon button usage.",
  },
  {
    name: "href",
    type: "string",
    description:
      "Makes the button render as a link. Prefer a true link when navigation is the main intent.",
  },
  {
    name: "target",
    type: '"_self" | "_blank" | "_parent" | "_top"',
    description: "Native link target when href is used.",
  },
  {
    name: "rel",
    type: "string",
    description: "Native link relationship when href is used.",
  },
  {
    name: "to",
    type: "string",
    description: "Route target when using a router link element.",
  },
  {
    name: "wrap",
    type: "boolean",
    description: "Allows the button text to wrap into multiple lines.",
  },
  {
    name: "stretch",
    type: "boolean",
    description: "Stretches the button to the available width.",
  },
  {
    name: "bounding",
    type: "boolean",
    description: "Extends the interactive bounding area beyond the visual button surface.",
  },
  {
    name: "element",
    type: "string | React.ElementType",
    description: "Overrides the rendered element for special integration cases.",
  },
  {
    name: "customContent",
    type: "React.ReactNode",
    description:
      "Injects custom content into the button. Use sparingly and test alignment/accessibility.",
  },
  {
    name: "skeleton",
    type: "boolean",
    description: "Shows a skeleton overlay while content is loading.",
  },
  {
    name: "tooltip",
    type: "string | React.ReactNode",
    description: "Adds tooltip content.",
  },
  {
    name: "status",
    type: '"error" | "information" | boolean',
    description: "Applies status styling and optionally a status message.",
  },
  {
    name: "statusState",
    type: '"error" | "information"',
    description: "Controls the semantic status state when status is used.",
  },
  {
    name: "statusProps",
    type: "object",
    description: "Additional FormStatus properties.",
  },
  {
    name: "globalStatus",
    type: "object",
    description: "Configuration used with GlobalStatus.",
  },
];

const buttonEventRows: PropertyRow[] = [
  {
    name: "onClick",
    type: "({ event }) => void",
    description: "Called on click. Receives an object with the native event.",
  },
];
