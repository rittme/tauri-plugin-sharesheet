// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use serde::Serialize;

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SharesheetOptions {
  pub mime_type: Option<String>,
  pub title: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase", tag = "type")]
pub enum SharePayload {
  #[serde(rename_all = "camelCase")]
  Text {
    text: String,
    #[serde(flatten)]
    options: SharesheetOptions,
  },
  #[serde(rename_all = "camelCase")]
  File {
    data: String, // base64 encoded data
    name: String,
    #[serde(flatten)]
    options: SharesheetOptions,
  }
}
