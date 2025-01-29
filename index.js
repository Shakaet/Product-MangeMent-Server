const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

// productUser
// qFe5UCEpHNjQP21p


app.get('/', (req, res) => {
  res.send('Hello WorldF!')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://productUser:qFe5UCEpHNjQP21p@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("Product");
    const userCollection = database.collection("users");
    const productCollection = database.collection("productsDb");
    const cartCollection = database.collection("CartDB");


    app.get("/addtocart/:email",async(req,res)=>{

      let email=req.params.email

      let query={buyer_email:email}
      let result=await cartCollection.find(query).toArray()
      res.send(result)

    })







    app.post("/addtocart",async(req,res)=>{
      let addToCartData=req.body
      let product_id=addToCartData.product_Id

      // console.log(product_id)

      let filter={_id:new ObjectId(product_id)}

      const updateDoc = {
        $set: {
          availability:false
        },
      };
       await productCollection.updateOne(filter, updateDoc);  
      const result = await cartCollection.insertOne(addToCartData);
      res.send(result)
    })

    app.get("/allproducts",async(req,res)=>{

     

      const result = await productCollection.find().toArray();
      res.send(result)


    })




    app.get("/product/:id",async(req,res)=>{

      let idx=req.params.id

      let query={_id:new ObjectId(idx)}

      const result = await productCollection.findOne(query);
      res.send(result)


    })



    app.patch("/product/:id",async(req,res)=>{


      let upData=req.body
      console.log(upData)

      let idx=req.params.id

      let filter={_id:new ObjectId(idx)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
            product_title: upData.product_title,
            product_image:upData.product_image,
            category: upData.category,
            price: upData.price,
            description:upData.description,
            Specification:upData.Specification,
            availability:upData.availability,
            rating: upData.rating,
        },
      };

      const result = await productCollection.updateOne(filter, updateDoc,options);
      res.send(result)

    })


    app.delete("/product/:id",async(req,res)=>{

      let idx=req.params.id

      let query={_id:new ObjectId(idx)}

      const result = await productCollection.deleteOne(query);
      res.send(result)

    })



    app.get("/allproduct",async(req,res)=>{

      let result=await productCollection.find().toArray()
      res.send(result)
    })


    app.get("/myaddedproduct/:email",async(req,res)=>{

      let email=req.params.email

      let query={email}
      let result=await productCollection.find(query).toArray()
      res.send(result)

    })


    app.post("/addproducts",async(req,res)=>{
      let productsData=req.body
      // console.log(productsData)
      const result = await productCollection.insertOne(productsData);
      res.send(result)
    })


    app.get("/users/admin/:email",async(req,res)=>{

      let email=req.params.email

     
      let query={email}
      let user= await userCollection.findOne(query)

      let admin=false
      if(user){
        admin= user?.role === "admin"
      }

      res.send({ admin })


    })

    app.get("/users/seller/:email",async(req,res)=>{

      let email=req.params.email

     
      let query={email}
      let user= await userCollection.findOne(query)

      let seller=false
      if(user){
        seller= user?.role === "seller"
      }

      res.send({ seller })


    })

    app.get("/users/user/:email",async(req,res)=>{

      let email=req.params.email

     
      let query={email}
      let users= await userCollection.findOne(query)

      let user=false
      if(users){
        user= users?.role === "user"
      }

      res.send({ user })


    })


    app.get("/users",async(req,res)=>{

      let result= await userCollection.find().toArray()
      res.send(result)
    })

    app.patch("/users/:email",async(req,res)=>{
      let email=req.params.email

      let query ={email}

      const updateDoc = {
        $set: {
          role: "pending Seller Request"
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
  
    })


    app.delete("/usersDeleted/:email",async(req,res)=>{

      let email=req.params.email
      console.log(email)

      let query={email}

      const result = await userCollection.deleteOne(query);

      res.send(result)
    })

    app.patch("/users/adminDeletedReqSeller/:email",async(req,res)=>{

      let email=req.params.email
      // console.log(email)

      let query ={email}

      const updateDoc = {
        $set: {
          role: "user"
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
  
    })

    app.patch("/users/adminUpdateSeller/:email",async(req,res)=>{

      let email=req.params.email
      // console.log(email)

      let query ={email}

      const updateDoc = {
        $set: {
          role: "seller"
        },
      };
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result)
  


    })

    app.post("/users",async(req,res)=>{

      let users=req.body;
      console.log(users)
      let email=users.email
      let query= {email}

      let existingUser= await userCollection.findOne(query)
      if(existingUser){
        return res.status(404).send({message:"Users already existed"})
      }
      const result = await userCollection.insertOne(users);
      res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})