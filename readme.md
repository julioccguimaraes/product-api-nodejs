# Informações
O projeto de desafio foi feito usando Node.js em conjunto com MySQL com auxílio dos seguintes frameworks/componentes:

- **Express**: framework que facilita a construção de aplicações web
- **knex**: construtor de consultas SQL. 
- **mysql2**: cliente MySQL para Node.js. Nesse projeto, trabalha em conjunto com o Knex.
- **body-parser**: middleware usado no projeto para conversão dos dados vindos de um request em objetos javascript
- **winston**: biblioteca de logs útil para armazenar os registros de ações e de erros 
- **morgan**: middleware para registros de solicitações HTTP. 
- **multer**: middleware para tratar uploads de arquivos em Node.js
- **dotenv**: carrega variáveis de ambiente de um arquivo .env 
- **config**: organiza as configurações do projeto para diferentes ambientes de implantação 
- **nodemon**: Usado somente em ambiente de desenvolvimento. Permite que a aplicação reinicie automaticamente quando modificações no projeto são detectadas 

# Instruções para rodar o projeto
- Crie um banco de dados MySQL. No projeto foi usado o nome *productapi*. Altere os dados de conexão no arquivo *.env* (raiz do projeto). Nota: esse arquivo  deveria estar no .gitignore por motivo de segurança. Ele foi deixado no repositório por se tratar de um projeto de desafio.
- Para criar as tabelas do banco de dados, use o arquivo *database.sql* na raiz do projeto.
- Execute o *npm install* para instalar todas as dependencias.
- Execute *npm run dev* ou *node index.js* para rodar o projeto.
- Na raiz do projeto tem a coleção Postman que pode ser usada para testar as rotas da API.

# Endpoints

## GET /product
Esse endpoint é responsável por retornar a listagem de todos os produtos cadastrados.

### Parâmetros
Nenhum

### Respostas
#### 200 OK
Você pode receber um array de produtos ou array vazio (ocorreu algum erro ou não foi encontrado produtos no bando de dados).  
Exemplo de resposta:
```
[
    {
        "product_id": 1,
        "name": "Product 01",
        "sku": "123456",
        "price": "10.0000",
        "description": "Product description 01",
        "quantity": 10,
        "image": "images\\foto-perfil.jpg1659468988912.jpg"
    },
    {
        "product_id": 4,
        "name": "Product 04",
        "sku": "789101112",
        "price": "40.0000",
        "description": "Product description 04",
        "quantity": 40,
        "image": "assets\\images\\product\\memoria-dell-01.png1659471027053.png"
    }
]
```
## POST /product
Esse endpoint é responsável cadastrar um produto

### Parâmetros
*image_field*: caminho da imagem a ser feito upload  
*name*: nome do produto (deve estar entre 2 e 255 caracteres)  
*sku*: código do produto (deve estar entre 1 e 255 caracteres e deve ser único)  
*price*: preço do produto (deve estar em decimal, exemplo: 15.00 para R$15,00)  
*description*: descrição do produto  
*quantity*: quantidade do produto em estoque  
*categories*: array dos ids das categorias que o produto pertence  

Essa rota recebe dados de um formulário, incluindo a imagem do produto. Por isso o body deve ser do tipo form-data.  
Exemplo de envio do formulário usando o Axios (cliente HTTP para Node.js):

```
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('image_field', fs.createReadStream('/C:/path/to/image/image.jpg'));
data.append('name', 'Product 1');
data.append('sku', '00001');
data.append('price', '10.00');
data.append('description', 'Product description 1');
data.append('quantity', '10');
data.append('categories[0]', '1');
data.append('categories[1]', '2');

var config = {
  method: 'post',
  url: 'localhost:3000/product',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

```
### Respostas
#### 200 OK
Resposta:
```
Product created!
```
#### 400 Bad Request
Há problemas com os dados enviados, por exemplo, dados inválidos.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "SKU is already registered!"
}
```
## GET /product/{product_id}
Esse endpoint é responsável por retornar os detalhes de um produto.

### Parâmetros
*product_id*: o id do produto

### Respostas
#### 200 OK
Você recebe os detalhes do produto.  
Exemplo de resposta:
```
{
    "product_id": 1,
    "name": "Product 01",
    "sku": "123456",
    "price": "10.0000",
    "description": "Product description 01",
    "quantity": 10,
    "image": "images\\image.jpg",
    "categories": [
        {
            "category_id": 4,
            "name": "Category 04"
        }
    ]
}
```
#### 404 Not Found
O produto não foi encontrado.  
Retorna um objeto vazio:
```
{}
```

## DELETE /product/{product_id}
Esse endpoint é responsável por excluir um produto.

### Parâmetros
*product_id*: o id do produto

### Respostas
#### 200 OK
Resposta:
```
Product deleted!
```
#### 406 Not Acceptable
Ocorreu um erro inexperado ao tentar deletar o produto.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Product does not exist!"
}
```
## PUT /product/{product_id}
Esse endpoint é responsável atualizar um produto.

### Parâmetros
*product_id*: o id do produto a ser atualizado  
*image_field*: caminho da imagem a ser feito upload  
*name*: nome do produto (deve estar entre 2 e 255 caracteres)  
*sku*: código do produto (deve estar entre 1 e 255 caracteres e deve ser único)  
*price*: preço do produto (deve estar em decimal, exemplo: 15.00 para R$15,00)  
*description*: descrição do produto  
*quantity*: quantidade do produto em estoque  
*categories*: array dos ids das categorias que o produto pertence  

Essa roda recebe dados de um formulário, incluindo a imagem do produto. Por isso o body deve ser do tipo form-data.  
Exemplo de envio do formulário usando o Axios (cliente HTTP para Node.js):

```
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('image_field', fs.createReadStream('/C:/path/to/image/image.jpg'));
data.append('name', 'Product 1');
data.append('sku', '00001');
data.append('price', '10.00');
data.append('description', 'Product description 1');
data.append('quantity', '10');
data.append('categories[0]', '1');
data.append('categories[1]', '2');

var config = {
  method: 'put',
  url: 'localhost:3000/product/1',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

```
### Respostas
#### 200 OK
Resposta:
```
Product updated!
```
#### 400 Bad Request
Há problemas com os dados enviados, por exemplo, dados inválidos.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "SKU is already registered!"
}
```
#### 406 Not Acceptable
Ocorreu um erro inexperado ao tentar atualizar o produto.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Product does not exist!"
}
```
## GET /category
Esse endpoint é responsável por retornar a listagem de todas as categorias cadastradas.

### Parâmetros
Nenhum

### Respostas
#### 200 OK
Você pode receber um array de categorias ou array vazio (ocorreu algum erro ou não foi encontrado categorias no bando de dados).  
Exemplo de resposta:
```
[
    {
        "category_id": 1,
        "name": "Category 01"
    },
    {
        "category_id": 2,
        "name": "Category 02"
    },
    {
        "category_id": 3,
        "name": "Category 03"
    }
]
```
## POST /category
Esse endpoint é responsável cadastrar uma categoria

### Parâmetros
*name*: nome da categoria  

Exemplo: 
```
{
    "name": "Category 04"
}

```
### Respostas
#### 200 OK
Resposta:
```
Category created!
```
#### 400 Bad Request
Há problemas com os dados enviados, por exemplo, nome da categoria inválido.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Name is invalid! Name must be greater than 2 and less than 255 characters!"
}
```
## GET /category/{category_id}
Esse endpoint é responsável por retornar os detalhes de uma categoria.

### Parâmetros
*category_id*: o id da categoria

### Respostas
#### 200 OK
Você recebe os detalhes da categoria.  
Exemplo de resposta:
```
{
    "category_id": 1,
    "name": "Category 01"
}
```
#### 404 Not Found
A categoria não foi encontrada.  
Retorna um objeto vazio:
```
{}
```

## DELETE /category/{category_id}
Esse endpoint é responsável por excluir uma categoria.

### Parâmetros
*category_id*: o id da categoria  

### Respostas
#### 200 OK
Resposta:
```
Category deleted!
```
#### 406 Not Acceptable
Ocorreu um erro inexperado ao tentar excluir a categoria.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Category does not exist!"
}
```
## PUT /category/{category_id}
Esse endpoint é responsável atualizar uma categoria.

### Parâmetros
*category_id*: o id da categoria  
*name*: nome da categoria

```
{
    "name": "Category 01 Test"
}

```
### Respostas
#### 200 OK
Resposta:
```
Category updated!
```
#### 400 Bad Request
Há problemas com os dados enviados, por exemplo, dados inválidos.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Name is invalid! Name must be greater than 2 and less than 255 characters!"
}
```
#### 404 Not found
O categoria não existe.  
Exemplo de resposta com mensagem de erro:
```
{
    "err": "Category does not exist!"
}
```
