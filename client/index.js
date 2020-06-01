const addTaskForm = document.querySelector('#addTaskForm')
const addTaskTitle = document.querySelector('#addTaskForm #title')
const addTaskBtn = document.querySelector('#addTaskBtn')
const addTaskDesc = document.querySelector('#addTaskForm #desc')
const addTaskMsg = document.querySelector('#addTaskMsg')

const tasksList = document.querySelector('#tasksList')
const tasksListMsg = document.querySelector('#tasksListMsg')

const listTasks = async () => {
  tasksList.innerHTML = ''
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')

  fetch('/api/tasks')
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }

      return response.json()
    })
    .then((response) => {
      response.forEach((task) => {
        const title = document.createElement('td')
        title.innerHTML = `<p>${task.title}</p>`

        const desc= document.createElement('td')

        const description=task.desc
        if (description!=''&&description!=null)
        {
          desc.innerHTML = `<p>${task.desc}</p>`
        }
        else
        {
          desc.innerHTML = `<p>Brak opisu</p>`
        }

        const timestamp = document.createElement('td')
        timestamp.innerHTML = `<p>${moment(task.Timestamp).format('DD-MM-YYYY')}</p>`

        const actions = document.createElement('td')
        actions.classList.add('has-text-right')
        actions.innerHTML = `<button class="button is-small is-primary" id="deleteTask${task.id}" onclick="completeTask('${task.id}');"><span class="icon is-small"><i class="fas fa-check"></i></span></button>`


        const row = document.createElement('tr')
        row.appendChild(title)
        row.appendChild(desc)
        row.appendChild(timestamp)
        row.appendChild(actions)

        tasksList.appendChild(row)
      })
    })
    .catch((e) => {
      console.log(e.message)
      tasksListMsg.textContent = 'Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie później.'
      tasksListMsg.classList.add('is-danger')
      tasksListMsg.classList.remove('is-hidden')
    })
}

listTasks()

const completeTask = (id) => {
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')

  const button = document.querySelector(`#deleteTask${id}`)
  button.classList.add('is-loading')

  setTimeout(() => {
    fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }

        tasksListMsg.textContent = 'Pomyślnie usunięto zadanie.'
        tasksListMsg.classList.add('is-success')

        listTasks()
      })
      .catch(() => {
        button.classList.remove('is-loading')
        tasksListMsg.textContent = 'Wystąpił błąd podczas usuwania zadania. Spróbuj ponownie później.'
        tasksListMsg.classList.add('is-danger')
      })
      .finally(() => {
        tasksListMsg.classList.remove('is-hidden')
      })
  }, 1000)
}

const addTask = async () => {
  const data = new FormData(addTaskForm)

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8'
  }) 

  const body = JSON.stringify({
    title: data.get('title'),
    description: data.get('desc')
  })

  return await fetch('/api/tasks', { method: 'POST', headers, body })
}

addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  addTaskBtn.classList.add('is-loading', 'is-disabled')
  addTaskMsg.classList.remove('is-danger', 'is-success')
  addTaskMsg.classList.add('is-hidden')

  setTimeout(() => {
    addTask()
      .then((response) => {
        if (!response.ok) {
          if (response.status==400)
          {
            throw Error('Nie można dodać zadania bez tytułu. Podaj tytuł zadania i spróbuj ponownie.')
          }


          throw Error('Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie później.')
        }

        addTaskMsg.textContent = 'Pomyślnie dodano zadanie.'
        addTaskMsg.classList.add('is-success')
        addTaskTitle.value = ''
        addTaskDesc.value = ''
        listTasks()
      })
      .catch((error) => {
        addTaskMsg.textContent = error.message
        addTaskMsg.classList.add('is-danger')
      })
      .finally(() => {
        addTaskBtn.classList.remove('is-loading', 'is-disabled')
        addTaskMsg.classList.remove('is-hidden')
      })
  }, 1000)    
})