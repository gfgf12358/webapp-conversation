import 'server-only'

import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = async (): Promise<Locale> => {
  return i18n.defaultLocale as Locale
}
