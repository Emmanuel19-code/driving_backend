import { addNewServcie } from "../services/serviceOffered.js";
import { serviceValidate } from "../validations/serviceOffered.js";

export const registerService = async (req,res)=>{
 try {
    const {error,value} = serviceValidate.validate(req.body)
    if(error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }
    const service = await addNewServcie(value);
 } catch (error) {
    return res.status(500).json({msg:"Internal server error",error})
 }
}