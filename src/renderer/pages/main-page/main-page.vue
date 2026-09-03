<script setup lang="ts">
import { computed, ref } from 'vue';
import { createWorkingDocument } from '../../../core/document/createWorkingDocument';
import type { WorkingDialectDocument } from '../../../core/document/types';
import type { DialectLayerName } from '../../../core/tokenization/tokenizeTextLayer';

const sample = `д'е́нь был т'о́плый\nм'ы́ шл'и́ дом'о́й`;
const rawText = ref(sample);
const document = ref<WorkingDialectDocument | null>(
    createWorkingDocument({ fileName: 'sample.txt', rawText1: sample }),
);
const activeLayer = ref<DialectLayerName>('text1');
const availableLayers: DialectLayerName[] = ['text1', 'text2', 'text3'];

const layerWords = computed(
    () => document.value?.words.map((word) => word.layers[activeLayer.value].value) ?? [],
);

function rebuildDocument() {
    document.value = createWorkingDocument({
        fileName: 'showcase.txt',
        rawText1: rawText.value,
    });
}

function setActiveLayer(layer: DialectLayerName) {
    activeLayer.value = layer;
}

async function openFile() {
    const result = await window.crocodileApi?.openPrimaryTxt?.();

    if (result?.ok && result.file) {
        rawText.value = result.file.content;
        document.value = createWorkingDocument({
            fileName: result.file.fileName,
            filePath: result.file.filePath,
            rawText1: result.file.content,
        });
    }
}
</script>

<template>
    <main class="page">
        <header class="hero">
            <div>
                <p class="eyebrow">Production-based public showcase</p>
                <h1>Vue + Electron text editor</h1>
                <p class="lead">
                    A sanitized version of a real desktop linguistic editor. Proprietary
                    morphology resources and legacy linguistic rules are intentionally excluded.
                </p>
            </div>
            <button class="primary" @click="openFile">Open .txt</button>
        </header>

        <section class="grid">
            <article class="panel">
                <div class="panel-head">
                    <strong>Source text</strong>
                    <button @click="rebuildDocument">Rebuild document</button>
                </div>
                <textarea v-model="rawText" spellcheck="false" />
            </article>

            <article class="panel">
                <div class="panel-head">
                    <strong>Tokenized document</strong>
                    <nav class="tabs">
                        <button
                            v-for="layer in availableLayers"
                            :key="layer"
                            :class="{ active: activeLayer === layer }"
                            @click="setActiveLayer(layer)"
                        >
                            {{ layer }}
                        </button>
                    </nav>
                </div>
                <div class="tokens">
                    <span v-for="(word, index) in layerWords" :key="index" class="token">
                        {{ word }}
                    </span>
                </div>
                <dl v-if="document" class="stats">
                    <div><dt>Words</dt><dd>{{ document.words.length }}</dd></div>
                    <div><dt>Sentences</dt><dd>{{ document.sentences.length }}</dd></div>
                    <div><dt>Dirty</dt><dd>{{ document.isDirty ? 'yes' : 'no' }}</dd></div>
                </dl>
            </article>
        </section>
    </main>
</template>

<style scoped lang="scss">
.page { max-width: 1280px; margin: 0 auto; padding: 48px; }
.hero { display: flex; justify-content: space-between; gap: 32px; align-items: flex-start; margin-bottom: 32px; }
.eyebrow { margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; }
h1 { margin: 0; font-size: 40px; line-height: 1.05; }
.lead { max-width: 720px; margin: 14px 0 0; color: #565b65; line-height: 1.55; }
.primary { border: 0; border-radius: 10px; background: #171717; color: white; padding: 12px 18px; cursor: pointer; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.panel { min-height: 420px; background: white; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,.04); }
.panel-head { height: 64px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ececef; }
.panel-head button { border: 1px solid #dadde2; background: white; border-radius: 8px; padding: 7px 10px; cursor: pointer; }
textarea { width: 100%; height: 356px; resize: none; border: 0; outline: none; padding: 20px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 15px; line-height: 1.7; }
.tabs { display: flex; gap: 4px; }
.tabs button.active { background: #171717; color: white; border-color: #171717; }
.tokens { padding: 20px; display: flex; flex-wrap: wrap; align-content: flex-start; gap: 8px; min-height: 270px; }
.token { padding: 7px 9px; border-radius: 8px; background: #f2f3f5; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.stats { display: flex; gap: 24px; padding: 16px 20px; margin: 0; border-top: 1px solid #ececef; }
.stats div { min-width: 80px; }
dt { font-size: 12px; color: #777; }
dd { margin: 4px 0 0; font-weight: 600; }
@media (max-width: 900px) { .page { padding: 24px; } .hero { flex-direction: column; } .grid { grid-template-columns: 1fr; } }
</style>
