let myInput = document.querySelector('#myInput'),
    myDiv = document.querySelector('#myDiv'),
    apiUrl = 'https://api.github.com/search/repositories?q=',
    inputs = Rx.Observable.fromEvent(myInput, 'keyup'),
    projectsList = new Rx.BehaviorSubject([]);


inputs
    .debounce(() => Rx.Observable.interval(500))
    .map(event => event.target.value)
    .filter(text => text.length > 2)
    .subscribe(searchProjects)


function searchProjects(projectName) {

    Rx.Observable.fromPromise(fetch(`${apiUrl}${projectName}`))
        .subscribe(response => {
            response
                .json()
                .then(result => result.items)
                .then(itemsList => { projectsList.next(itemsList) })
        })
}

projectsList.subscribe(projects => {

    var template = '';
    projects.forEach(project => {
        template += `
        
        <li class="project-list-item" >

            <div class="container-fluid bg_primary" style=" padding-left: 0px; padding-right: 0px;">   
                
                    <div class="row justify-content-center no-gutters">
                        <div class="col-12 col-md-12 bg-light border border-1 rounded no-gutters p-3 p-md-0">
                            <div class="row justify-content-center align-items-center no-gutters py-1 py-md-4 hzcard-container">
                                <div class="col-12 col-md-3 align-self-center no-gutters">
                                    <figure class="figure text-center m-0 pr-0 pr-md-3">
                                        <img src='${project.owner.avatar_url}' alt='' title="Fonte: GitHub.com" class='figure-img img-fluid rounded m-0'>
                                    </figure>
                                </div>
                                <div class="col-12 col-md-8 no-gutters ml-3 mt-2 mt-md-0 ">
                                <h5 <strong>${project.owner.login}</strong> / ${project.name}</h5>
                                <p class="card-text">${project.description}</p>
                                <p class="card-text">Forks: ${project.forks}</p>
                                <a href="${project.owner.html_url}" class="btn btn-primary" target="_blank">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
				
		</li>
        `
    })
    myDiv.innerHTML = ` <ul class="project-list"> ${template} </ul>`


})