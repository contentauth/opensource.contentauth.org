---
name: edit-doc
description: Apply style rules when editing technical documentation. Use whenever the user asks to edit, review, clean up, or improve any docs, README, or written technical content.
---
# Edit docs

## Overview

This skill provides style and typography guidance for editing technical documentation.

## Glossary

Before starting, fetch the glossary: https://opensource.contentauthenticity.org/docs/getting-started/glossary and apply the terminology and conventions defined there.

## Sentence case headings

All headings should use sentence case.

## No links in headings

Do not use hyperlinks in headings. If needed, move the link into a sentence in the heading's section.

## Keep headings brief

Long headings do not work well in a page table of contents, so keep headings brief, yet meaningful.  Do not use parenthesis in headings if possible.

## Capitalization

Only proper nouns should be capitalized.  Feature names, UI elements, and other things should not be capitalized, except in special cases.  Official product names and code names should be capitalized.

## Code font

Code elements such as object, method, and property names should be in code (monospace) font, that is, enclosed in back tick (`) characters.  Also use code font for for file names and directory paths.

But do not follow this rule in headings.  In other words, do not use code font in headings.

## Active voice

Always use active voice, unless it makes a sentence awkward.

## Avoid duplication

Don't repeat the same information, unless there is a very good reason to do so. In cases where the duplication is blatant, remove them.  Otherwise, flag them for review.

## Numbers

In running text, spell out one through nine; use numerals for 10 and greater. The same rule applies to ordinals: Spell out first through ninth; use numerals for 10th and greater.

## Commas

Use the serial or Oxford comma (a comma preceding "and" or "or" in a list of three or more items) such as "This, that, and the other".

## User interface elements

Use bold for user interface elements such as button or link text, essentially anything that you see on the screen in a UI.

## No horizontal rules separating sections

If any horizontal rules are placed between sections, remove them.

## Avoid em-dashes when possible

Use other punctuation for interjections.  In many cases, a colon works for a phrase delimited by an em-dash at the end of a sentence.

## Always do a basic spell check

Make sure spelling is correct, and flag any uncommon words.

## Use Docusaurus admonitions in the contentauth/opensource.contentauth.org repository

For documents in the contentauth/opensource.contentauth.org repository only, use Docusaurus  admonitions (alerts) for: Note, Info, Tip, and Warning.  Use this format instead of just putting "Note," "Warning," and so on, inline in text.  For example:
:::note
This is the note text.
:::

# Use GitHub flavored markdown admonitions for all other repositories in the contentauth org

For documents in all other repositories in the contentauth org, use GitHub flavored markdown admonitions (alerts) for: Note, Tip, Important, and Warning.  Use this format instead of just putting "Note," "Warning," and so on, inline in text.  For example:
> [!NOTE]
> This is the note text.
