const dummy = (blogs) => {
     return 1
}

const totalLikes = (blogs) => {
   const result = blogs.reduce(function(acc, obj) {
       return acc + obj.likes
   }, 0)

   console.log(result)
}

const favoriteBlog = (blogs) => {
    const sortedBlogs = blogs.sort((prev, next) => { 
        (prev.likes < next.likes) ? 1 
        : (prev.likes > next.likes) ? -1 
        : 0 })
        
    console.log(sortedBlogs)
    return sortedBlogs[1]

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
