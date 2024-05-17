import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import methodOverride from "method-override";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

class Blog {
     constructor(){
          this.blogs = [];
     }

     dataTemplate(id, title, content){
          return {
               "id": id,
               "title": title,
               "content": content
          }
     }

     createBlog(id, title, content){
          this.blogs.push(this.dataTemplate(id, title, content));
     }

     updateBlog(id, title, content){
          const index = this.blogs.findIndex(blog => blog.id === id);
          if(index !== -1){
               this.blogs[index].title = title;
               this.blogs[index].content = content;
          }else{
               console.log("Blog not found!");
          }
     }

     deleteBlog(id){
          this.blogs = this.blogs.filter(blog => blog.id !== id);
     }

     getBlogById(id){
          return this.blogs.find(blog => blog.id === id);
     }

     getAllBlogs(){
          return this.blogs;
     }
};

const blog = new Blog(); // Declare blog

// Get home page
app.get('/', (req, res) => {
     res.render('index.ejs', {allBlogs: blog.getAllBlogs()});
});

// Create
app.get('/blog/create', (req, res) => {
     res.render('create.ejs');
});
app.post('/blog/create', (req, res) => {
     blog.createBlog(uuidv4(), req.body.blog_title, req.body.blog_content);
     res.redirect('/');
});

// Edit
app.get('/blog/:id/edit', (req, res) => {
     var blogId = req.params.id;
     const edit_blog = blog.getBlogById(blogId);
     
     // Get the blog among array if no array return errors
     if(!edit_blog){
          res.redirect('/');
     }

     res.render('edit.ejs', {blog: edit_blog});
});
app.post('/blog/:id/edit', (req, res) => {
     var blogId = req.params.id;
     const edit_blog = blog.getBlogById(blogId);
     
     // Get the blog among array if no array return errors
     if(!edit_blog){
          res.redirect('/');
     }

     blog.updateBlog(blogId, req.body.blog_title, req.body.blog_content);

     res.redirect('/');
});

// Delete
app.delete('/blog/:id', (req, res) => {
     // Delete blog here
     blog.deleteBlog(req.params.id);
     res.redirect('/');
});

app.listen(port, () => {
     console.log(`Server is listening on port: ${port}`);
});