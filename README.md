# VueJS Helper

![demo](asset/demo.gif)

This extension allows a quick development when using VueJS.

Included commands are the following ![Commands](asset/commands.png)

- Add Method: allows to easily create a new function inside the `methods` section. If `methods` section does not exist, it will be created.
- Add reactive variable: allows to easily create a new variable inside the `data` function. If `data` function does not exist, it will be created.
- Add props: allows to easily create a new `prop` asking for:
    - Prop name
    - Allowed type(s)
    - Default value
    - Whether if the prop should be required or not
- Add Watch: allows to easily create a new function inside the `watch` section. If `watch` section does not exist, it will be created.
- Create SFC: starts a wizard to create a Single File Component, asking for:
    - Component name
    - Whether to add `template` tag, `style` tag and if it should be included in a separate folder. If `style` tag is selected, the user will be prompted to choose a pre-processor too
    ![Wizard](asset/tags.PNG)
    ![Pre-processors](asset/pre-processors.png)


## Code actions
The extension allows also to easily add `methods`, `data` and `watch` from each section in the Single File Component. 

![Lenses](asset/lenses.png)