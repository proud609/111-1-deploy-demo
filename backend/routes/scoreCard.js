import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

const saveScoreCard = async (name, subject, score) => {

    const existing = await ScoreCard.findOne({ name: name, subject: subject });
    if (existing){
        existing.score = score;
        existing.save();
        return "Updating ("+name+", "+subject+", "+ score+")";
    }
    try {
        const newScordCard = new ScoreCard({ name: name, subject: subject,score:score });
        newScordCard.save();
        return "Adding ("+name+", "+subject+", "+ score+")";
    } catch (e) { throw new Error("Score card creation error: " + e); }
};

const deleteDB = async () => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
        return "Database cleared";
    } catch (e) { throw new Error("Database deletion failed"); }
};

const searchScoreCard = async (type, queryString) =>{
    
    let q_set;
    if(type === 'name'){
        q_set = await ScoreCard.find({ name: queryString });
    }
    else if (type === 'subject'){
        q_set = await ScoreCard.find({ subject: queryString });
    }
    
    if (q_set.length > 0){
        let re_str_list = [] ;
        for (let index = 0; index < q_set.length; index++) {
            const element = q_set[index];
            re_str_list.push('Found card with '+type+': ('+element.name+', '+element.subject+', '+element.score+') ');
        }
        return re_str_list
        
    }
    else{
        
        return  type+" ("+queryString+") not found!";
    }
}
router.delete("/cards", async (_,res) => {

    const delresp = await deleteDB();
    res.send({message:delresp});
});

router.post("/card", async (req, res) => {

    let data = req.body
    let name = data.name
    let subject = data.subject
    let score = data.score

    const createresp = await saveScoreCard(name,subject,score);
    
    res.send({message:createresp,card:true});

});

router.get("/cards", async(req, res) => {

    let type = req.query.type
    let q_string = req.query.queryString
    const queryresp = await searchScoreCard(type,q_string);
    
    if(Array.isArray(queryresp))
        res.send({message:queryresp,messages:true})
    else
        res.send({message:queryresp,messages:false})
});

export default router;