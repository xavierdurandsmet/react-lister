
import * as express from "express";

var router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
	res.render('index', {
		 user: req.user
	});
})

export = router;