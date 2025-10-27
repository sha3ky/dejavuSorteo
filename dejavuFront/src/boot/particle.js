import { boot } from 'quasar/wrappers'
import Particles from '@tsparticles/vue3'
import { loadStarsPreset } from 'tsparticles-preset-stars'

export default boot(async ({ app }) => {
  console.log('🚀 Particles boot file loaded')

  app.use(Particles, {
    init: async (engine) => {
      console.log('⭐ Loading stars preset...')
      await loadStarsPreset(engine)
    },
  })
})
