import {
  BoxRenderable,
  OptimizedBuffer,
  RGBA,
  type BoxOptions,
  type RenderContext,
} from "@opentui/core";
import { extend } from "@opentui/react";

class ButtonRenderable extends BoxRenderable {
  private _label: string = "Button";
  protected override _focused: boolean = false;
  protected override _focusable: boolean = true;
  private _focusBackgroundColor: string;

  constructor(
    ctx: RenderContext,
    options: BoxOptions & { 
      label?: string; 
      focused?: boolean;
      backgroundColor?: string;
    },
  ) {
    super(ctx, {
      border: false,
      minHeight: 3,
      ...options,
    });

    this._focusBackgroundColor = options.backgroundColor || "#5A5A6A";

    if (options.label) {
      this._label = options.label;
    }
    
    if (options.focused !== undefined) {
      this._focused = options.focused;
    }
  }

  protected override renderSelf(buffer: OptimizedBuffer): void {
    // Set background color based on focus state
    if (this._focused) {
      buffer.fillRect(
        this.x,
        this.y,
        this.width,
        this.height,
        RGBA.fromHex(this._focusBackgroundColor)
      );
    }

    super.renderSelf(buffer);

    const centerX =
      this.x + Math.floor(this.width / 2 - this._label.length / 2);
    const centerY = this.y + Math.floor(this.height / 2);

    buffer.drawText(
      this._label,
      centerX,
      centerY,
      RGBA.fromInts(255, 255, 255, 255),
    );
  }

  set label(value: string) {
    this._label = value;
    this.requestRender();
  }

  override set focused(value: boolean) {
    this._focused = value;
    this.requestRender();
  }

  override get focused(): boolean {
    return this._focused;
  }

}

declare module "@opentui/react" {
  interface OpenTUIComponents {
    createButton: typeof ButtonRenderable;
  }
}

extend({ createButton: ButtonRenderable });
