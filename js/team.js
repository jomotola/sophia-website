const teamContainer = document.querySelector("#team-container");

if (teamContainer) {
  fetch("../data/team.json")
    .then((response) => response.json())
    .then((data) => displayDepartments(data));
}

function displayDepartments(departments) {
  teamContainer.innerHTML = "";

  departments.forEach((department) => {
    let html = `

        <section class="department">

            <h3>${department.department}</h3>

            <div class="team-grid">

        `;

    department.members.forEach((member) => {
      html += `

            <div class="person-card">

                <img
                    src="${member.image}"
                    alt="${member.name}"
                >

                <div class="person-info">

                    <h3>${member.name}</h3>

                    <p id="role">${member.role}</p>

                    <p class="person-quote">"${member.quote}"</p>

                </div>

            </div>

            `;
    });

    html += `

            </div>

        </section>

        `;

    teamContainer.innerHTML += html;
  });
}
