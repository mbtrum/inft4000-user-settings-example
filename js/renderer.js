const pathElement = document.getElementById('txtPath')
const btn = document.getElementById('btn-open')

window.electronAPI.loadSettings((event, value) => {
    pathElement.value = value
})

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFolder()
  pathElement.value = filePath
  window.electronAPI.saveSettings(filePath)
})