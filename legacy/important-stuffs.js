var proj = document.getElementById('projects')
var skills = document.getElementById('skills')
var media = document.getElementById('media')

proj.style.display = "block"
skills.style.display = "none"
media.style.display = "none"

// could be better, but the world wont end if i leave it as it is

function showProjects(){
    proj.style.display = "block"
    skills.style.display = "none"
    media.style.display = "none"
}

function showSkills(){
    proj.style.display = "none"
    skills.style.display = "block"
    media.style.display = "none"
}

function showMedia(){
    proj.style.display = "none"
    skills.style.display = "none"
    media.style.display = "block"
}