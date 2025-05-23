// Copyright (C) 2023 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import m from 'mithril';
import {Editor} from '../../widgets/editor';
import {Engine} from '../../trace_processor/engine';
import {Trace} from '../../public/trace';

export interface ChatPageAttrs {
  readonly trace: Trace;
  readonly prompt: string;
  readonly setPrompt: (spec: string) => void;
}

export class ChatPage implements m.ClassComponent<ChatPageAttrs> {
  private engine: Engine;

  constructor({attrs}: m.CVnode<ChatPageAttrs>) {
    this.engine = attrs.trace.engine.getProxy('ChatPage');
    this.engine = this.engine;
  }
  view({attrs}: m.CVnode<ChatPageAttrs>) {
    return m(
      '.page.chat-page',
      m(Editor, {
        initialText: attrs.prompt,
        onExecute(text) {
          attrs.setPrompt(text);
        },
      }),
    );
  }
}
