// Type definitions for templated-assets-webpack-plugin 4.0
// Project: https://github.com/jouni-kantola/templated-assets-webpack-plugin
// Definitions by: Claude <https://github.com/anthropics/claude-code>

/**
 * Webpack plugin for creating templated assets to be used with server rendered web frameworks.
 *
 * @example
 * ```js
 * const TemplatedAssetsWebpackPlugin = require("templated-assets-webpack-plugin");
 *
 * module.exports = {
 *   plugins: [
 *     new TemplatedAssetsWebpackPlugin({
 *       rules: [
 *         {
 *           name: "app",
 *           output: {
 *             inline: true
 *           }
 *         }
 *       ]
 *     })
 *   ]
 * };
 * ```
 */
declare class TemplatedAssetsWebpackPlugin {
  /**
   * Creates a new instance of the plugin.
   * @param options - Plugin configuration options
   */
  constructor(options?: TemplatedAssetsWebpackPlugin.PluginOptions);

  /**
   * Apply the plugin to the webpack compiler.
   * @param compiler - The webpack compiler instance
   */
  apply(compiler: any): void;
}

declare namespace TemplatedAssetsWebpackPlugin {
  /**
   * Asset information passed to template functions.
   */
  interface AssetInfo {
    /** Source asset filename */
    filename: string;
    /** Asset source content */
    source: string;
    /** Built-in processor's result */
    content: string;
    /** URL to asset, including publicPath (or "/") */
    url: string;
  }

  /**
   * Template processing function.
   * @param asset - Asset information
   * @param callback - Callback to invoke with the templated asset content
   * @param args - Additional arguments passed from rule.args
   */
  type TemplateFunction = (
    asset: AssetInfo,
    callback: (templatedAsset: string) => void,
    ...args: any[]
  ) => void;

  /**
   * Template configuration object.
   */
  interface TemplateObject {
    /** Path to custom template file */
    path?: string;
    /** Placeholder in template for substitution with asset url/source */
    replace?: string | RegExp;
    /** Content to prepend to templated asset */
    header?: string | (() => string);
    /** Content to append to templated asset */
    footer?: string | (() => string);
  }

  /**
   * Template configuration.
   * - string: Path to template file
   * - object: Detailed template configuration
   * - function: Custom template processor
   */
  type Template = string | TemplateObject | TemplateFunction;

  /**
   * Output configuration for templated assets.
   */
  interface OutputOptions {
    /** Custom name for the templated asset */
    name?: string | ((defaultName: string) => string);
    /** Prefix for templated asset's filename */
    prefix?: string;
    /** File extension for templated asset (default: "html") */
    extension?: string;
    /** Reference asset by URL (default: true when inline is false) */
    url?: boolean;
    /** Include async attribute (default: false) */
    async?: boolean;
    /** Include defer attribute (default: false) */
    defer?: boolean;
    /** Link asset with nomodule attribute (default: false) */
    nomodule?: boolean;
    /** Link as module asset (default: false) */
    module?: boolean;
    /** Inline asset's source instead of URL reference (default: false) */
    inline?: boolean;
    /** Include templated asset in webpack's output (default: true) */
    emitAsset?: boolean;
    /** Output folder(s) for templated assets */
    path?: string | string[];
  }

  /**
   * Rule matching by name.
   */
  interface RuleByName {
    /** Match asset by chunk name */
    name: string | string[];
    /** Filter out assets by filename */
    exclude?: RegExp;
    /** Template configuration */
    template?: Template;
    /** Placeholder for asset substitution */
    replace?: string | RegExp;
    /** Arguments passed to template function */
    args?: any[];
    /** Output configuration */
    output?: OutputOptions;
  }

  /**
   * Rule matching by test pattern.
   */
  interface RuleByTest {
    /** Match asset by filename pattern */
    test: RegExp;
    /** Filter out assets by filename */
    exclude?: RegExp;
    /** Template configuration */
    template?: Template;
    /** Placeholder for asset substitution */
    replace?: string | RegExp;
    /** Arguments passed to template function */
    args?: any[];
    /** Output configuration */
    output?: OutputOptions;
  }

  /**
   * Rule for matching and templating assets.
   * Must specify either `name` or `test`.
   */
  type Rule = RuleByName | RuleByTest;

  /**
   * Plugin configuration options.
   */
  interface PluginOptions {
    /** Array of rules for matching and templating assets */
    rules?: Rule[];
  }
}

export = TemplatedAssetsWebpackPlugin;
