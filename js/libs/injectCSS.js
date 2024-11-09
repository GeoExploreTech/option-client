function inJectCSS(templateName) {
  // Inject external CSS
  const cssContent = GM_getResourceText(templateName);
  GM_addStyle(cssContent);
}
