import mongoose from 'mongoose';
import User from "./models/user-schema"
import Event from './models/event-schema';

class DbMongoose{
  name: String
  constructor(name: String){
    this.name=name
    this.connectDb();
  }
connectDb()
{
  let dbOptions = {
  dbName: ""+this.name
}

  mongoose.connect("mongodb+srv://nenechi:nenechi12@exercise11.cfvsryo.mongodb.net/?retryWrites=true&w=majority", dbOptions);
}

disconnectdb(){
  mongoose.connection.close()
}


async addUser(nameUser:String, passwd:String, classes: String[]){
  const abie= new User({ name:nameUser, password: passwd, class: classes })
  await abie.save();
 
}

async addEvent(id:String, date:Date, title: String, desc: String, sectionName:String){
  const abie= new Event({ id:id, date: date, title: title, desc: desc, associatedSection: {name: sectionName}})
  console.log(abie)
  await abie.save();
}

async getUserByClasss(classname: String){
  const result= await User.find({class: classname})
  console.log(result)
  return result;
}

async getAllUsers(){ 
  const result= await User.find()
  console.log(result)
  return result;
}


}
//Example of how it can be used
// const b= new DbMongoose('test');
// const date=new Date()
// const description="Today I had an interview at 2pm but the Interviewer is making me wait and it 5h20pm already should I quit?"
// b.addEvent("2",date,"Intership", description, "Section0003")
export default DbMongoose;



