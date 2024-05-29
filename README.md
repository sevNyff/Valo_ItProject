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
  "token":"429f0c26e40ec800",
  "truckID":"2",
  "packages": [
        {
            "packageWeight": "1",
            "deliveryAddress": "Brugg AG",
            "customerID":"3"
        },
        {
            "packageWeight": "1",
            "deliveryAddress": "Bern",
            "customerID":"3"
        },
        {
            "packageWeight": "1",
            "deliveryAddress": "Zürich",
            "customerID":"3"
        }
  ]
  }