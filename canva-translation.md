> ## Documentation Index
>
> Fetch the complete documentation index at: https://www.canva.dev/docs/apps/llms.txt
> Use this file to discover all available pages before exploring further.

# Localization overview

Canva can translate your app into other languages.

Canva has a large global audience, with most users originating from non-English speaking countries. Localizing your app is an important part of the submission process and is a way to reach a much larger audience.

To make your app available in more languages, Canva performs free translations for apps that have successfully completed the app review process.

NOTE: Only an app's UI strings can be localized, so strings in creative content (such as images) are not included.

## Supported locales

Canva supports a broad range of locales, while the Apps SDK supports a subset of these locales. These are chosen based on their proportion of Canva's users.

The supported locales are:

- Arabic: `ar-EG`
- Dutch: `nl-NL`
- French: `fr-FR`
- German: `de-DE`
- Indonesian: `id-ID`
- Italian: `it-IT`
- Japanese: `ja-JP`
- Korean: `ko-KR`
- Malay: `ms-MY`
- Polish: `pl-PL`
- Portuguese: `pt-BR`
- Romanian: `ro-RO`
- Spanish: `es-ES` and `es-419`
- Swedish: `sv-SE`
- Thai: `th-TH`
- Turkish: `tr-TR`
- Vietnamese: `vi-VN`

NOTE: The supported locales might change over time.

## How localization works

The Canva translation process currently requires use of the `react-intl` library.

To internationalize your app, add the `react-intl` library to your project. This lets you use `FormattedMessage` components for the UI text, using US English.

1. Extract the UI strings into a JSON file and upload it as part of the review process.
2. When your app is approved, Canva identifies which languages are needed and performs the translation. This process also translates the app name, description, among others. Note that Canva translates the strings for you, and you can't provide your own translations.
3. Test your app with the new locales and release it when you're ready. For more information, see [Testing localization](https://www.canva.dev/docs/apps/localization/recommended-workflow/#step-2-testing-localization).
4. Users with a matching Canva language setting will automatically see the app in their language.

   If their language is unavailable, the app can fallback to a similar language, otherwise it will default to English.

Translated strings are only supplied to your frontend JS code, so you should avoid displaying strings directly from the backend. Instead, have the backend return a status code or other response data. The UI can then use this to display an appropriate `FormattedMessage`.

## MessageFormat syntax

The Canva translation process supports a subset of the International Components for Unicode (ICU) `MessageFormat` syntax. We recommend using ICU because it allows you to capture grammatical elements that may differ between languages, such as plurals and correct placement of placeholders within a sentence.

For more information about the supported ICU syntax with recommendations and examples, see [ICU syntax](https://www.canva.dev/docs/apps/localization/icu-syntax/).

## Bad practices

For common pitfalls encountered when localizing your app, see [Bad practices](https://www.canva.dev/docs/apps/localization/bad-practices/).

## Add notes for translators

To assist Canva's translators, you can include notes that describe the purpose and context of each string. This information is stored in the `description` property for each `FormattedMessage` and is made available to the translators.

### Preferred: UI location and intention

An effective translator note should explain where the text content is used in the UI, and what the user's intention is.

In this example, the UI element text is consistent with the user's intention, and the translator can accurately identify the meaning:

```ts
<FormattedMessage
   defaultMessage="Edit"
   description="A button label for the user to go back to editing the text input."
/>
```

This example includes details about the user's intention. This prevents ambiguity and provides the translator with context, which helps them disambiguate terms:

```ts
<FormattedMessage
   defaultMessage="Apply all"
   description="A label for a button element that applies all of the user's selected settings to the design."
/>
```

You can also use the translator note description to specify the intended meaning of your words and the character limit:

- **If a word can have more than one meaning**, specify the intended meaning. Some words can be used as either a verb or a noun:

  ```ts
  <FormattedMessage
     defaultMessage="Translate"
     description="This is the name of the Canva app. It is a noun."
  />
  ```

  ```ts
  <FormattedMessage
     defaultMessage="Translate"
     description="This is the label on a button to translate the design content. It is a verb."
  />
  ```

- **If space is limited or characters are restricted**, specify the maximum number of characters. If possible, allocate more space for the string than the English text requires, because many languages are lengthier than English and need more space than the source string:

  ```ts
  <FormattedMessage
     defaultMessage="Continue with work email"
     description="Option for the user to continue the login process using an email associated with their job. Max. number of characters: 32"
  />
  ```

### Translator note bad practices

- **Avoid** differences in meaning between the source and the translator note. This is an issue when translators can't accurately identify the string's meaning. In this example, the element text in the default message doesn't match the description's meaning:

  ```ts
  <FormattedMessage
     defaultMessage="Unmark"
     description="A button label for the user to go back to editing the text input."
  />
  ```

- **Avoid** ambiguity between the source and the translator note. Ambiguity can confuse translators when they need to identify the meaning from a range of applicable interpretations. This example is ambiguous in the description:

  ```ts
  <FormattedMessage
     defaultMessage="Apply all"
     description="Select and apply settings."
  />
  ```

## Excluding text

If you have strings that shouldn't be localized, then you can exclude them from the translation process by not putting them within the `FormattedMessage` component. This means that the string won't be included in the extracted JSON file. In addition, you must use an ESLint directive to ignore the rule which would usually prevent you from hard-coding English text. For example:

```typescript
// eslint-disable-next-line no-literal-string-in-jsx
<Text>Text that must not be translated</Text>
```

## Locale fallback

When your app has been translated and released, Canva will identify the locale for the current user and supply the best supported translations it has for your app.

For example, if your app has "Standard" language translation and the user's language is Canadian French (`fr-CA`), Canva will fallback to the best supported translations, which will be French (`fr-FR`).

If Canva can't find translations for a user's preferred language and there are no fallbacks available, then the app always falls back to English `en`.

## Localize backend responses

Translated strings are only supplied to your frontend JS code, so you should avoid displaying strings directly from the backend. Instead, have the backend return a status code or other response data, and the UI can then use this to display an appropriate `FormattedMessage`.

For more information, see [Localize backend responses](https://www.canva.dev/docs/apps/localization/backend-responses/).

## Localization outside React components

For strings used outside React components, use the `initIntl` function from `@canva/app-i18n-kit`.

For more information, see [Localize outside React components](https://www.canva.dev/docs/apps/localization/outside-react-components/).

## More information

- How to use the recommended workflow: [Recommended workflow](https://www.canva.dev/docs/apps/localization/recommended-workflow/)
- How to localize an existing app: [Migrate an existing app](https://www.canva.dev/docs/apps/localization/migrate-an-existing-app/)
- How to localize backend responses: [Localize backend responses](https://www.canva.dev/docs/apps/localization/backend-responses/)
- Localization outside React components: [Localize outside React components](https://www.canva.dev/docs/apps/localization/outside-react-components/)
- Review the localization design guidelines: [Localization](https://www.canva.dev/docs/apps/design-guidelines/localization/)
- See the supported syntax and exceptions: [ICU syntax](https://www.canva.dev/docs/apps/localization/icu-syntax/)
- See bad practices: [Bad practices](https://www.canva.dev/docs/apps/localization/bad-practices/)
