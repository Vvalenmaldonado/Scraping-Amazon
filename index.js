const puppeteer = require ("puppeteer");

(async () =>{
    const browser = await puppeteer.launch({headless: false}); //Abrirnos un navegador (google chrome) -- si agregamos al .launch( {headless: false} ) Podemos ver lo que esta pasando. 
    const page =  await browser.newPage(); // Abre una pestana del navegar, nos permite interactuar con la pagina que le asignemos. 
    await page.goto('http://amazon.com'); //Para ir a una pagina en concreto uso el metodo .goto()
    await page.screenshot({path: 'amazon1.jpg'}); //Sacarle un screenshot a la pagina que estamos ubicados y la guardamos en una ruta 

    //Puppeter te permite interactuar con los elementos de la pagina EJ: 'El input buscador' a traves del ID. 

    await page.type('#twotabsearchtextbox', 'Libros de Javascript'); // Utilizamos la funcion type() 1P: Le mandamos el ID del input 2P: Le decimos lo que va a buscar. (LO ESCRIBE, NO LO BUSCA)
    await page.screenshot({path: 'amazonInput.jpg'}); //Le hago otra captura de pantalla para saber si lo realizo. 

    await page.click('.nav-search-submit input'); // Utilizamos .click() para que inicie una busqueda. Le mandamos el ID de donde esta encerrado el input.

    //La pagina tiene que esperar que al selector (Donde esta guardada el resultado de busqueda) 

    await page.waitForSelector('[data-component-type=s-search-result]'); //Como la espera es sobre un atributo se lo pone entre []
    await page.waitForTimeout(13000); // para darle tiempo de espera antes de terminar la ejecucion. 
    await page.screenshot({path: 'amazonBusqueda.jpg'}); 


    //Para investigar dentro de la pagina usamos page.evaluate(). Inspecciona toda la pagina.  EJ. recuperar TODOS los elementos que tenga este selector '[data-component-type=s-search-result]'

    const enlaces = await page.evaluate(()=>{   //A traves del selector recuperamos todos los links
         const producto = document.querySelectorAll(['[data-component-type=s-search-result] h2 a']);
         const links = []; //Creamos un array vacio donde se van a guardar todos los links 
         //creamos un for para que los recorra
         for (let element of producto){
             links.push(element.href); //Al recorrer los elementos los vamos pusheando en el array vacio previamente declarado. 
         }
         return links; // al retornar los links los devuelve a la constante 'Enlaces' Asi pueedo sacarlos afuera de la funcion .evaluate()
    });

    console.log(enlaces.length); //Asi sabemos cuantos enlaces nos devuelve. ej; 16

    //Luego de obtener los enlaces. Tenemos que recorrerlos (for) para ir moviendonos a cada uno de esos enlaces.

    for(let enlace of enlaces){
        await page.goto(enlace); //.goto(Nos mueve a cada uno de esos enlaces)
        await page.waitForSelector('#productTitle'); //Le decimos que espere a cada titulo del producto 

       const books = []; //Creamos un array vacio donde se van a guardar los titulos de los libros y sus autores... 

        //Como guardamos cada titulo que recorremos? Usando .evaluate(()=>{}) con una funcion anonima. 
       const book = await page.evaluate(()=>{
            const titulos = {}; //creamos un objeto donde vamos almacenar el titulo.
            titulos.title = document.querySelector('#productTitle').innerText; // Agregamos el titulo al objeto titulos y como es un span, lo pasamos a formato text. 
            titulos.author = document.querySelector('.author a').innerText;  //Agregamos al objeto titulos, el autor y lo pasamos a formato text.
            titulos.price = document.querySelector('.a-color-base span').innerText;
            titulos.calification = document.querySelector('#acrCustomerReviewText').innerText;
           titulos.img = document.querySelector('.a-dynamic-image').src;
            return titulos;
        })
        books.push(book);

        console.log(books);
        
    }
    



     




    await browser.close();
})();
