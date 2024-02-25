class HomeController {
    /**
     * @param {Request} req 
     * @param {Response} res 
     */
    getHome(req, res) {
        res.render("home.hbs");
    }


}

export default new HomeController();