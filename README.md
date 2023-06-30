# MEDUSAS EYE'S - Ferramenta de segmentação de imagens

## 1. Introdução
A Medusas Eyes é uma startup voltada para soluções de problemas utilizando visão computacional, aprendizado de máquina, computação em nuvem etc. Este produto consiste em uma ferramenta que proporciona aos usuários uma experiência facilitada para segmentação de imagens.

## 2. Tecnologias Utilizadas
- Linguagem de Programação: Typescript
- Framework: Next.js
- Bibliotecas: Ant-Design e momentjs


## 3. Guia de uso
Inicialmente a ferramenta possui duas telas que consistem em: Tela de submissão de classes e imagens e a tela de segmentação. Serão explicadas nesta seção.

### 3.1 Tela de submissão de classes e imagens
Nesta tela, o usuário deve fornecer as classes de segmentação, utilizando o campo de entrada de texto. O usuário deve inserir o nome de cada classe desejada e pressionar "Enter" para adicioná-la à lista de classes disponíveis. Bem como pode clicar no X no cartão referente a uma classe que deseja excluir.

Para carregar as imagens que serão segmentadas, o usuário pode utilizar a opção de arrastar e soltar (drag and drop) na área designada. Se preferir, também é possível clicar na área para abrir o explorador de arquivos e selecionar as imagens manualmente. Após fornecer as classes e carregar as imagens, o botão "Criar Projeto" será habilitado. O usuário pode clicar nesse botão para ser direcionado à tela de segmentação.

### 3.2 Tela de segmentação

Nesta tela, você terá acesso a diversas ferramentas e elementos essenciais para a segmentação das máscaras.

#### 3.2.1 Visualização da Imagem:

A imagem selecionada para segmentação será exibida nesta área. Inicialmente a primeira imagem que foi submetida na tela anterior será considerada a imagem selecionada. A imagem será redimensionada para se adequar à tela, mantendo a proporção original para evitar rolagens excessivas.

Você pode aplicar zoom in e zoom out na imagem para realizar uma segmentação mais precisa. Utilize os botões de zoom disponíveis para ajustar a visualização conforme necessário. Para iniciar a segmentção basta clicar no botão com o ícone de "start" e assim ao clicar dentro da área da imagem será adicionado um ponto da máscara a ser segmentada. 

Vale ressaltar que todas as ações que o usuário poderá realizar dependem do estado atual da segmentação, por exemplo, se o usuário ainda não começou a segmentação ele não poderá escolher um ponto pra editar ou remover, bem como não selecionar previamente um ponto , também não será possível efetuar essas ações. Mais na frente serão descritas todas as funções possíveis, no que diz respeito a segmentação da imagem selecionada.

#### 3.2.2 Seleção de Classes:

Localizada na parte superior esquerda da tela, o usuário encontrará 3 elementos que pretendem mostrar, de diferentes formas, informações sobre as classes e máscaras da imagem selecionada. São eles:
 - O primeiro card possui duas abas onde na primeira mostra a quantidade e quais são as classes segmentadas naquela imagem, a segunda aba mostra uma lista, onde cada item da lista tem o nome da classe referente a aquela máscara e um botão com um ícone de lixeira, o item também é um elemento clicável, onde ao efetuar a ação de clique a máscara referente será selecionada. 
 - O segundo card possui um campo de seleção onde por padrão irá iniciar com a primeira classe submetida na página anterior selecionada. Ainda neste campo, o usuário poderá alterar a classe selecionando-a.
 - O terceiro card irá mostrar qual máscara está selecionada no momento, mostrando seu nome, classe e data de criação, caso não exista máscara selecionada irá mostrar uma mensagem indicando que não existe classe selecionada.

#### 3.2.4 Ações de Segmentação:

A direita da interface pode ser encontrada uma seção destinada aos botões de ações, que podem ser executadas antes, durante e depois da segmentação da imagem, os quais podem mudar de estado de ao decorrer da segmentação. Aqui está a relação de todos os botões presentes:
1. Reverter último ponto da máscara: reverte a última ação realizada na máscara, permitindo desfazer o último ponto adicionado ou modificado.
2. Excluir ponto selecionado: remove o ponto atualmente selecionado na máscara, possibilitando ajustes e correções.
3. Editar ponto selecionado: permite a edição precisa do ponto selecionado na máscara, facilitando refinamentos e ajustes.
4. Iniciar segmentação: inicia o processo de segmentação da imagem, onde o usuário pode começar a marcar as áreas desejadas.
5. Finalizar segmentação: finaliza a máscara que está sendo segmentada.
6. Zoom in: amplia a imagem para obter uma visualização mais detalhada e precisa.
7. Zoom out: reduz a imagem para ter uma visão mais geral e ampla da área segmentada.
8. Mover para cima (quando com zoom): desloca a imagem para cima, permitindo a visualização de áreas superiores quando estiver aplicado o zoom.
9. Mover para baixo (quando com zoom): desloca a imagem para baixo, possibilitando visualizar áreas inferiores quando estiver aplicado o zoom.
10. Mover para esquerda (quando com zoom): desloca a imagem para a esquerda, permitindo a visualização de áreas laterais quando estiver aplicado o zoom.
11. Mover para direita (quando com zoom): desloca a imagem para a direita, possibilitando a visualização de áreas laterais quando estiver aplicado o zoom.
12. Excluir máscara: exclui completamente a máscara selecionada, removendo todas as marcações, referentes aquela máscara, feitas.
13. Exportar JSON: permite exportar os dados da segmentação em formato JSON, possibilitando o uso posterior desses dados em outras aplicações ou análises.

## JSON exportado
O arquivo JSON exportado obedece ao template usado pela base COCO, o qual é amplamente aceito como entrada em algoritmos de aprendizado de máquina voltados para reconhecimento de objetos. 
Aqui está um exemplo de como é esse arquivo JSON
```
{
   "annotations":[
      {
         "id_mask":1,
         "image_id":0,
         "category_id":1,
         "segmentation":[
            [
               552,
               353,
               1039,
               473,
               942,
               214,
               692,
               172
            ]
         ],
         "bbox":[
            473,
            1039,
            172,
            552
         ]
      }
   ],
   "images":[
      {
         "id":0,
         "file_name":"wallhaven-oxmzj5.png",
         "url":"blob:http://localhost:3000/9ebce77f-a71b-4b15-93a5-be1dc142b862",
         "height":800,
         "width":1422
      }
   ],
   "categories":[
      {
         "id":0,
         "name":"Alita"
      }
   ]
}
``` 
- ```annotations```: É um array que contém as anotações das imagens. No exemplo, há uma única anotação presente dentro desse array.
  - ```id_mask```: Identificador da máscara, com valor igual a 1 no exemplo.
  - ```image_id```: Identificador da imagem associada à anotação, com valor igual a 0 no exemplo.
  - ```category_id```: Identificador da categoria à qual a anotação pertence, com valor igual a 1 no exemplo.
  - ```segmentation```: Esta matriz contém as coordenadas da segmentação da anotação. No exemplo, há um único conjunto de coordenadas representado por pares de valores x e y: [552, 353, 1039, 473, 942, 214, 692, 172].
  - ```bbox```: Esta matriz representa a caixa delimitadora (bounding box) da anotação, especificando as coordenadas x e y do ponto superior esquerdo e as dimensões da caixa. No exemplo, a caixa delimitadora é [473, 1039, 172, 552].

- ```images```: É um array que contém informações sobre as imagens associadas às anotações.
  - ```id```: Identificador da imagem, com valor igual a 0 no exemplo.
  - ```file_name```: Nome do arquivo da imagem, que é "wallhaven-oxmzj5.png" no exemplo.
  - ```url```: URL da imagem, apontando para "blob:http://localhost:3000/9ebce77f-a71b-4b15-93a5-be1dc142b862".
  - ```height```: Altura da imagem em pixels, com valor igual a 800 no exemplo.
  - ```width```: Largura da imagem em pixels, com valor igual a 1422 no exemplo.

- ```categories```: É um array que contém informações sobre as categorias das anotações.
  - ```id```: Identificador da categoria, com valor igual a 0 no  exemplo.
  - ```name```: Nome da categoria, que é "Alita" no exemplo.