export const initForm = (onSubmit) => {
  const form = document.getElementById('form')
  const input = document.getElementById('input')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    onSubmit(input.value)
  })
};
