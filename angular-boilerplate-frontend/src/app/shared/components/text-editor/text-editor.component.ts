import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { FormsModule, ControlValueAccessor, NgControl } from '@angular/forms';
import { TablerIconComponent } from '../tabler-icon/tabler-icon.component';
import { TablerIcon } from '../tabler-icon/tabler-icon-list';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';

import BlotFormatter from 'quill-blot-formatter-2';
import Quill from 'quill';

Quill.register('modules/blotFormatter', BlotFormatter);

const ImageBlot = Quill.import('formats/image') as any;
const ATTRIBUTES = ['alt', 'height', 'width', 'style', 'data-align', 'draggable'];

type StringMap = { [key: string]: string | null };

interface BlotWithDomNode {
  domNode: HTMLElement;
  super: (name: string, value: string) => void;
}

class CustomImage extends ImageBlot {
  static blotName = 'image';
  static tagName = 'img';

  static create(value: any) {
    const node = super.create(value);
    node.setAttribute('draggable', 'true');
    return node;
  }

  static formats(domNode: HTMLElement) {
    return ATTRIBUTES.reduce((formats: StringMap, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {} as StringMap);
  }

  format(name: string, value: string) {
    const self = this as unknown as CustomImage & BlotWithDomNode;

    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        self.domNode.setAttribute(name, value);
      } else {
        self.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(CustomImage, true);

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, TablerIconComponent],
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent implements ControlValueAccessor, OnInit {
  @ViewChild('editor', { static: false })
  quillEditorComponent!: QuillEditorComponent;

  @Input() viewMode = false;
  @Input() hiddenHeader = false;
  _TablerIcon = TablerIcon;

  value = '';
  disabled = false;
  rawQuillEditor: any;
  pendingValue: string | undefined = undefined;

  blotFormatter: any;

  // 👇 unique toolbar id per component instance
  private static nextId = 0;
  toolbarId = `contact-toolbar-${TextEditorComponent.nextId++}`;

  modules: any;

  formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'indent',
    'list',
    'link',
    'image',
  ];

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.modules = {
      toolbar: {
        container: `#${this.toolbarId}`,
        handlers: {
          undo: function () {
            (this as any).quill.history.undo();
          },
          redo: function () {
            (this as any).quill.history.redo();
          },
        },
      },
      history: { delay: 500, maxStack: 200, userOnly: true },
      keyboard: {
        bindings: {
          tab: {
            key: 9,
            handler: function (_range: any, context: any) {
              const quill = (this as any).quill;
              if (quill) {
                quill.format('indent', context.shiftKey ? '-1' : '+1', 'user');
              }
              return false;
            },
          },
        },
      },
      blotFormatter: {},
    };
  }

  onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {

    const newValue = value ?? '';
    this.value = newValue;

    if (this.rawQuillEditor) {
      this.setEditorContent(this.value);
      this.pendingValue = undefined;
    } else {
      this.pendingValue = this.value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInternalChange(v: string) {
    this.value = v;
    this.onChange(v);
  }

  editorCreated(editor: any) {
    this.rawQuillEditor = editor;

    if (this.pendingValue !== undefined) {
      this.setEditorContent(this.pendingValue);
      this.pendingValue = undefined;
    }
  }

  private setEditorContent(content: string): void {
    if (!this.rawQuillEditor) return;

    this.rawQuillEditor.clipboard.dangerouslyPasteHTML(content || '', 'silent');

    this.rawQuillEditor.setSelection(null);
    (this.rawQuillEditor.root as HTMLElement).blur();
  }
}
