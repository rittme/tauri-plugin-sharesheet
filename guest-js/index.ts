// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import { invoke } from "@tauri-apps/api/core";

export interface SharesheetOptions {
  // Android and iOS
  mimeType?: string;
  title?: string;
}

/**
 * Opens the Sharesheet to share the specified text.
 *
 * ```javascript
 * import { shareText } from "@tauri-apps/plugin-sharesheet";
 * await shareText('I am a shared message');
 * ```
 * @param text The text to share
 * @param options Additional options for sharing
 * @returns
 */
export async function shareText(
  text: string,
  options?: SharesheetOptions,
): Promise<void> {
  await invoke("plugin:sharesheet|share_text", {
    text,
    ...options,
  });
}

/**
 * Opens the Sharesheet to share a file using base64 data.
 *
 * ```javascript
 * import { shareFile } from "@tauri-apps/plugin-sharesheet";
 * // Share a file from a Blob
 * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * const reader = new FileReader();
 * reader.onload = async () => {
 *   const base64Data = reader.result.split(',')[1];
 *   await shareFile(base64Data, 'hello.txt', { mimeType: 'text/plain' });
 * };
 * reader.readAsDataURL(blob);
 * ```
 * @param data Base64 encoded file data
 * @param name The filename to use
 * @param options Additional options for sharing
 * @returns
 */
export async function shareFile(
  data: string,
  name: string,
  options?: SharesheetOptions,
): Promise<void> {
  // If data is a Data URL, extract the base64 part
  if (data.startsWith("data:")) {
    const base64Data = data.split(",")[1];
    data = base64Data;
  }

  await invoke("plugin:sharesheet|share_file", {
    data,
    name,
    ...options,
  });
}

/**
 * Helper function to share a Blob as a file.
 *
 * ```javascript
 * import { shareBlob } from "@tauri-apps/plugin-sharesheet";
 * const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
 * await shareBlob(blob, 'hello.txt');
 * ```
 * @param blob The Blob to share
 * @param name The filename to use
 * @param options Additional options for sharing
 * @returns
 */
export async function shareBlob(
  blob: Blob,
  name: string,
  options?: SharesheetOptions,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        await shareFile(base64Data, name, {
          mimeType: blob.type,
          ...options,
        });
        resolve();
      } catch (error) {
        reject(error as Error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}
