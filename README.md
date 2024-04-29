# Valo_ItProject

To check the H2 Database:
- Start the Server
- First go to http://localhost:8080/h2-console
- Select as JSBC URL: jdbc:h2:mem:ITPROJECT
- Complete Password and Username

What format does the server accept?
- To logIn and register: { "userName":"Anna","password":"anna"}
- To save a tour: 
{
  "token":"4973f25082f76000",
  "truckID":"7888",
  "packages": [
  {
  "packageWeight": "34",
  "deliveryAddress": "Brugg"
  },
  {
  "packageWeight": "23",
  "deliveryAddress": "Aarau"
  },
  {
  "packageWeight": "235",
  "deliveryAddress": "Baden"
  }
  ]
  }