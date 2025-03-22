// Copyright 2019-2023 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

import LocalAuthentication
import SwiftRs
import Tauri
import UIKit
import WebKit
import SwiftUI
import UIKit
import Foundation

struct SharesheetOptions: Decodable {
  let text: String
  let mimeType: String?
  let title: String?
}

struct ShareFileOptions: Decodable {
  let data: String
  let name: String
  let mimeType: String?
  let title: String?
}

class SharesheetPlugin: Plugin {
  var webview: WKWebView!
  public override func load(webview: WKWebView) {
    self.webview = webview
  }

  @objc func shareText(_ invoke: Invoke) throws {
    let args = try invoke.parseArgs(SharesheetOptions.self)

    DispatchQueue.main.async {
      let activityViewController = UIActivityViewController(activityItems: [args.text], applicationActivities: nil)
      
      // Display as popover on iPad as required by apple
      activityViewController.popoverPresentationController?.sourceView = self.webview // display as a popover on ipad
      activityViewController.popoverPresentationController?.sourceRect = CGRect(
        x: self.webview.bounds.midX,
        y: self.webview.bounds.midY,
        width: CGFloat(Float(0.0)),
        height: CGFloat(Float(0.0))
      )

      self.manager.viewController?.present(activityViewController, animated: true, completion: nil)
    }
  }
  
  @objc func shareFile(_ invoke: Invoke) throws {
    let args = try invoke.parseArgs(ShareFileOptions.self)
    
    // Decode base64 string to data
    guard let decodedData = Data(base64Encoded: args.data) else {
      throw NSError(domain: "app.tauri.sharesheet", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid base64 data"])
    }
    
    // Create a temporary file to store the data
    let tempDirectory = FileManager.default.temporaryDirectory
    let fileURL = tempDirectory.appendingPathComponent(args.name)
    
    do {
      try decodedData.write(to: fileURL)
      
      DispatchQueue.main.async {
        let activityViewController = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        
        // Display as popover on iPad as required by apple
        activityViewController.popoverPresentationController?.sourceView = self.webview
        activityViewController.popoverPresentationController?.sourceRect = CGRect(
          x: self.webview.bounds.midX,
          y: self.webview.bounds.midY,
          width: CGFloat(Float(0.0)),
          height: CGFloat(Float(0.0))
        )
        
        self.manager.viewController?.present(activityViewController, animated: true, completion: nil)
      }
    } catch {
      throw error
    }
  }
}

@_cdecl("init_plugin_sharesheet")
func initPlugin() -> Plugin {
  return SharesheetPlugin()
}