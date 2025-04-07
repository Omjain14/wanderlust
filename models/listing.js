const mongoose=require("mongoose");
const reviews = require("./reviews");
const { type } = require("../schema");
const Review=require("./reviews.js")
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{ 
        type:String,
        required:true,
    },
    description:String,
    type:Object,
    image:{
    type:Object,
    default:function(){
        return{
    filename:'listingimage',
    url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"
   };
},
    set:function(v){
    return v===""
    ?{filename:'listingimage',url:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60"} 
    :v;
    }
},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
       type:  Schema.Types.ObjectId,
       ref:"User",
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'], // Only accept 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    //   category:{
    //     type:String,
    //     enum:["mountains","arctic","farms"]
    //   }
      
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
