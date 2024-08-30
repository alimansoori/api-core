import Color from 'color'
import { injectable } from 'tsyringe'
@injectable()
export class ColorUtils {
  public getColorWithHighestContrast<T extends readonly string[]>(base_color: string, colors: T): T[number] {
    const base_luminosity = new Color(base_color).luminosity()
    return [...colors].sort(
      (a, b) =>
        Math.abs(new Color(b).luminosity() - base_luminosity) - Math.abs(new Color(a).luminosity() - base_luminosity),
    )[0]
  }
  public isDark(hex_color: string) {
    const color = new Color(hex_color)
    return color.isDark()
  }
}
