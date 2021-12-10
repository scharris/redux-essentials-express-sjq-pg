
# Excercise server side api via command line
To learn about and test the server side of the application, it's helpful to use the command line
to create http requests like the client side of the application would, and to the see the server's
responses to the requests printed as output.

The below are PowerShell commands which can be run in a separate command shell, assuming that
the application is running as described above.

Here `iwr` is a short name for PowerShell's "Invoke-WebRequest". For MacOS and Linux, you
can either install Powershell version 7 (recommended) to run these commands as is, or else
adapt the commands to use the `curl` executable instead. If you use `curl`, instead of `iwr`
from within Powershell, some command parameters will have to be adjusted (e.g. http methods
are set via `-X` instead of `-Method`), details can be easily found online.

TODO

## Get all foo items.
```
iwr http://localhost:3001/api/foos
```

You should see a response like:
```
StatusCode        : 200
StatusDescription : OK
Content           : [{"id":1,"name":"#1 in A","category":"A","description":"first foo of category A"},{"id":2,"name":"#2 in A","category":"A","description":"second foo of
                    category A"},{"id":3,"name":"#1 in B","category": ...
```

## Get item 2.
```
iwr http://localhost:3001/api/foos/2
```

## Add a new item (assigned id = 7).
```
iwr http://localhost:3001/api/foos -Method POST `
   -Headers @{"Content-Type"="application/json"} `
   -Body '{"item":{"name": "new seventh item"}}'
```

## Update the new item.
```
iwr http://localhost:3001/api/foos/7 -Method PUT `
   -Headers @{"Content-Type"="application/json"} `
   -Body '{"item":{"id": 7, "name": "seventh item updated"}}'
```

## View updated new item.
```
iwr http://localhost:3001/api/foos/7
```

## Delete the new item.
```
iwr http://localhost:3001/api/foos/7 -Method DELETE
```
