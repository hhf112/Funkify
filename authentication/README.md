# API

## Register POST `/register`
### Request (JSON) 
```JSON
{
    "username": string,
    "password": string,
    "email": string,
}
```
### Return: JSON
```JSON
{
    "success": false,
    "message": string
}

```
```JSON
{
    "success": true,
    "message": string,
    "user": userModel
}

```
## Login GET `/login`
Expected request Body: JSON
### Request (JSON) 
```JSON
{
    "username": string,
    "password": string
}
```
### Return: JSON
```JSON
{
    "success": false,
    "message": string
}

```
```JSON
{
    "success": true,
    "message": string,    
    "accessToken": string,
}

```
## LogOut DELETE `/logout`
### Request (JSON) 
```JSON
{
    "refreshToken": string
}
```
### Return: JSON
```JSON
{
    "success": boolean,
    "message": string
}

```
## Token GET `/token`
### Request (JSON) 
```JSON
{
    "refreshToken": string
}
```
### Return: JSON
```JSON
{
    "success": boolean,
    "message": string,
    "accessToken": string:
}

```
