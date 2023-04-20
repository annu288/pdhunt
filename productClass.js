class Product {
  comments = [];
  tags = [];
  noOfUpvotes = 0;
  noOfComments = 0;

  constructor(
    name,
    visit_url,
    icon_url,
    short_desp,
    long_desp,
    created_by,
    created_on,
    updated_by,
    updated_on
  ) {
    this.name = name;
    this.visit_url = visit_url;
    this.icon_url = icon_url;
    this.short_desp = short_desp;
    this.long_desp = long_desp;
    this.created_by = created_by;
    this.created_on = created_on;
    this.updated_by = updated_by;
    this.updated_on = updated_on;
  }

  addComments(comment) {
    this.comments.push(comment);
    this.noOfComments++;
  }

  getComments() {
    console.log(this.comments);
  }

  addTag(tag) {
    this.tags.push(tag);
  }

  upvote() {
    this.noOfUpvotes++;
  }
}

class Comment {
  constructor(id, description, created_by) {
    this.id = id;
    this.description = description;
    this.created_by = created_by;
  }
}

class Tag {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
// let chatGPT = new Product("chatGPT","chatGPT.com","chatGPT1.com","jhgfdfghbjnkmljhgfdft","kjhghfdfghbj",1,"22-02-2023");

// chatGPT=JSON.stringify(chatGPT);
// console.log(chatGPT);
// const comment1 =  new Comment(1,"nice product",3);
// abcd.addComments(comment1);

// const tag1 = new Tag(1,"Artificial Intelligence");
// chatGPT.addTag(tag1);

// chatGPT.upvote();

// console.log(chatGPT);

module.exports = { Product, Comment, Tag };
