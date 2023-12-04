
import './App.css';
import Nav from './NavBar';
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";


//url for backend
const createUrl = "http://localhost:3050/create";
const updateUrl = "http://localhost:3050/update";
const deleteUrl = "http://localhost:3050/delete";

function App() {

  const [contacts, setContacts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [succMsg, setSuccMsg] = useState(false);

  //provide Oauth
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();


  //fetch contact from database
  const fetchContacts = async () => {

    if (isAuthenticated) {
      try {
        const response = await fetch(`http://localhost:3050/getcontact?user=${user.email}`,
          {
            method: 'GET'
          });
        const data = await response.json();
        setContacts(data);
        setShowTable(true);
        setSuccMsg(true);

      }
      catch (err) {
        setErrMsg("HubSpot could not be connected");
      }
    }
    else {
      loginWithRedirect();
    }

  };

  //disconnect from hubspot
  const disConnect = async () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
    setSuccMsg(false);
    setShowTable(false);
  };

  //display form for create new contact
  const displayForm = async () => {
    setShowForm(true);
  };


  //save new contact
  const createContact = async () => {
    const response = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        user
      })
    });
    setFirstName("");
    setEmail("");
    setLastName("");
    setPhone("");
  }




  return (
    <div className="App">

      <Nav />

      <br></br>

      <button className='button1' onClick={fetchContacts}>Connect With Hubspot</button>
      &nbsp;&nbsp;&nbsp;

      {/* message of success or failed */}
      {succMsg ? ("Connected with HubSpot successfully") : errMsg}

      <button className='button2' onClick={disConnect}>Disconnect</button>

      <br></br>

      {/* display contact into table */}
      {showTable && (
        <table className='table'>
          <thead>
            <tr>
              <th className='th'>Name</th>
              <th className='th'>Email</th>
              <th className='th'>Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(cont => (
              <tr key={cont.id}>
                <td className='td'>{cont.firstName + " " + cont.lastName}</td>
                <td className='td'>{cont.email}</td>
                <td className='td'><button onClick={async () => {

                  let fInput =
                    prompt("Enter the updated First Name:", cont.firstName);

                  let lInput =
                    prompt("Enter the updated Last Name:", cont.lastName);

                  let eInput =
                    prompt("Enter the updated Email:", cont.email);

                  let pInput =
                    prompt("Enter the updated Phone:", cont.phone);

                  //update contact details
                  const editedData = contacts.map((row) => {
                    if (row._id === cont._id) {
                      // Simulate updating the value
                      row.firstName = fInput;
                      row.lastName = lInput;
                      row.email = eInput;
                      row.phone = pInput;
                    }
                    return row;
                  });

                  // Update the state with the edited data
                  setContacts(editedData);

                  let oldemail = cont.email;

                  //save edited details
                  const response = await fetch(updateUrl, {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      oldemail,
                      fInput,
                      lInput,
                      eInput,
                      pInput,
                      user
                    })
                  });

                }}>Edit</button>
                  &nbsp;&nbsp;

                  {/* delete contact */}
                  <button onClick={async () => {
                    //delete row
                     const dataRow = [...contacts];
                     dataRow.splice(cont._id, 1);
                     setContacts(dataRow);

                    //delete from database
                    const res = await fetch(deleteUrl, {
                      method: 'POST',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        cont,
                        user
                      })
                    });
                   
                   
                  }}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br></br>
      <br></br>
      <button className='button3' onClick={displayForm}>Create</button>

      {/* create new contact */}
      {showForm && (
        <>
          <div className='create'>
            <h4>Contact Details</h4>
            <form className='form'>
              <label>Contact First name  &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <br></br>
              <br></br>
              <label>Contact Last name  &nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <br></br>
              <br></br>
              <label>Contact Email  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <br></br>
              <br></br>
              <label>Contact Phone  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </form>

            <button className='button4' onClick={createContact}>Save</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
