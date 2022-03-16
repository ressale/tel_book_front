import {useEffect, useState} from "react"
let url = '192.168.1.107:7000'
const App = () => {

    const [data, setData] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [idForChange, setIdForChange] = useState('')
    const [input, setInput] = useState({})
    console.log(data)

    //!!!!!!!!!
    const handleInputValue = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    useEffect(() => {

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }

        fetch(`http://${url}/app/get_contact/`, requestOptions)
            .then(response => response.text())
            .then(result => setData(JSON.parse(result)))
            // .then(result => console.log(result.status))
            .catch(error => console.log('error', error))
    }, [])

    // !!!!!!!!!!
    const addContact = () => {
        // обрабатывается двойной запрос на стороне сервера
        // сначала post для добавления контакта, после get для обновления данных на клиенте
        let myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")

        let raw = JSON.stringify({
            "name": input.name,
            "phone": input.phone
        })

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        fetch(`http://${url}/app/add_contact/John/34`, requestOptions)
            .then(response => response.text())
            .then(result => setData(JSON.parse(result)))
            .catch(error => console.log('error', error))
    }

    const delContact = (_id) => {

        //del contact
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "_id": _id
        })

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        //get contact
        let requestOptions_1 = {
            method: 'GET',
            redirect: 'follow'
        }

        fetch(`http://${url}/app/delete_contact/`, requestOptions)
            .then(response => {
                    if (response.ok)
                        return fetch(`http://${url}/app/get_contact/`, requestOptions_1)
                            .then(response => response.text())
                            .then(result => setData(JSON.parse(result)))
                            .catch(error => console.log('error', error))
                }
            )
    }

    const changeContact = () => {

        // change contact
        let myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")

        let raw = JSON.stringify({
            "idForChange": idForChange,
            "name": input.name,
            "phone": input.phone
        })

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }

        //get contact
        let requestOptions_1 = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`http://${url}/app/change_contact/`, requestOptions)
            .then(response => {
                    if (response.ok)
                        return fetch(`http://${url}/app/get_contact/`, requestOptions_1)
                            .then(response => response.text())
                            .then(result => setData(JSON.parse(result)))
                            .catch(error => console.log('error', error))
                }
            )
    }

    const searchContact = (data) => {
        let myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({data}),
            redirect: 'follow'
        }

        fetch(`http://192.168.1.107:7000/app/search_contact/`, requestOptions)
            .then(response => response.text())
            .then(result => setData(JSON.parse(result)))
            .catch(error => console.log('error', error))
    }

    return (
        <>
            <form>
                <label>Name</label>
                <input name='name' onChange={handleInputValue}/>
                <label>Phone</label>
                <input name='phone' onChange={handleInputValue}/>
                <button onClick={addContact} type='button'>Add contact</button>
                <button onClick={() => {
                    setDisabled(true)
                    changeContact()
                }} type='button' disabled={disabled}>Change contact
                </button>
                <label>Searcher</label>
                <input onChange={(e) => searchContact(e.target.value)}/>
            </form>
            <hr/>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                </tr>
                <>
                    {
                        data ?
                            data.map(el => {
                                    return (
                                        <tr>
                                            <td>{el.name}</td>
                                            <td>{el.phone}</td>
                                            <button onClick={() => {
                                                setDisabled(false)
                                                setIdForChange(el._id)
                                            }}>Change
                                            </button>
                                            <button onClick={() => delContact(el._id)}>Delete</button>
                                        </tr>
                                    )
                                }
                            )
                            : <>Loading...</>
                    }
                </>
            </table>
        </>
    )
}

export default App
