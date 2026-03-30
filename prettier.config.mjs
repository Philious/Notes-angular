export default {
  plugins: ['prettier-plugin-angular', 'prettier-plugin-organize-attributes'],
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,

  // Angular template-specific
  htmlWhitespaceSensitivity: 'ignore',
  bracketSameLine: false,

  // Attribute order for Angular templates
  attributeGroups: [
    '$DEFAULT', // anything not matched below stays here
    '^\\*', // structural directives: *ngIf, *ngFor
    '^\\[\\(', // banana-in-a-box: [(ngModel)]
    '^\\[', // property bindings: [input]
    '^\\(', // event bindings: (click)
    '^#', // template refs: #myRef
  ],
  attributeSort: 'ASC', // alphabetical within each group
};
