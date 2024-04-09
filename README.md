# Search for tags

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/TitouanCREACH.search-tags)
[Extension link](https://marketplace.visualstudio.com/items?itemName=TitouanCREACH.search-tags)

Search in your code by input an emmet abbreviation.

<img src="https://github.com/titouancreach/search-tags/assets/3995719/a55cf926-3b6f-4fb3-9a07-a726da68c99c" style="width: 150px; height: 150px" />


## Why

This is very common to want to search an element with multiple classNames whatever they are ordered.

If you want to search an element which has `bg-red-500` and `text-gray-900` (because you spotted it in the "developper window" for example), you want to search element that matches:

```html
<div className="bg-red-500 text-gray-900" />

<!-- but also -->
<div className="bg-red-500 flex text-gray-900" />

<!-- but also -->
<div className="text-gray-900 flex flex-col bg-red-500" />
```

This is what this plugin is made for.

## Usage

1. Open the command panel with <kbd>&#8984;</kbd> + <kbd>&#x21E7;</kbd> + <kbd>P</kbd>.

2. Select the "Search" command.

3. Input an Emmet abbreviation.

> [!WARNING]  
> For this version, only a very light subset is supported. Only classes (ex: ".flex.flex-grow.gap-2") are supported.  
> Only single line matches are supported for now.

4. Press <kbd>Enter</kbd>. A regex is copied to your clipboard.

5. Open the search panel, make sure your have checked the "regex" checkbox, and past the content of your clipboard.

## Future

- Support Emmet abbrevitation with a tag (ex: `span.bg-red-500.flex` )
- Support ids (ex: `.bg-red#foo`)
- Support multilines
- Support [twc](https://github.com/gregberge/twc)
- More flexibility in general
