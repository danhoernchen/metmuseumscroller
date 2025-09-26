const count = 30;
const loadingContainer = document.getElementById("loader");
const baseUrl = "http://localhost:8088";
const imageContainer = document.getElementById("image-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const errorContainer = document.getElementById("error");
let doneLoading = false;
let loadedCount = 0;
let totalCount = 0;
let listCounter = 0;
let photosArr = [];
let list = [];
function imageLoaded() {
  loadedCount++;
  console.log(totalCount, loadedCount);
  if (loadedCount >= 5) {
    doneLoading = true;
    loadingContainer.hidden = true;
  }
}

const getObjectList = async (search) => {
  console.log(search);
  try {
    const res = await fetch(`${baseUrl}/search/${search}`);
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
};

const getObject = async (id) => {
  const object = await fetch(baseUrl + `/objects/${id}`);
  const json = await object.json();
  if (!json.failedWith && json.primaryImage) {
    const newObj = {
      image: json.primaryImage,
      title: json.title,
      date: json.objectDate,
      link: json.objectURL,
    };
    return newObj;
  } else {
    console.log("errored");
    return null;
  }
};

// const objectsArr = async (list) => {
//   result = [];
//   let i = 0;
//   while (list.length > 0 && i < 30) {
//     const object = await getObject(list[0]);
//     list.shift();
//     i++;
//     if (object !== null) {
//       result.push(object);
//     }
//   }
//   totalCount = result.length;
//   return result;
// };

const displayPhotos = (data) => {
  loadedCount = 0;
  data.forEach(async (id) => {
    const obj = await getObject(id);
    if (obj !== null) {
      const figure = document.createElement("figure");
      const figcaption = document.createElement("figcaption");
      const link = document.createElement("a");
      const description = document.createElement("p");
      description.innerText = obj.date;
      link.innerText = obj.title;
      link.setAttribute("href", obj.link);
      link.setAttribute("target", "_blank");
      figcaption.append(link);
      figcaption.append(description);
      const img = document.createElement("img");
      img.src = obj.image;
      img.alt = obj.title;
      img.title = obj.title;
      img.addEventListener("load", imageLoaded);
      figure.append(img);
      figure.append(figcaption);
      imageContainer.append(figure);
    }
  });
};

const scrollHandler = () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    doneLoading
  ) {
    doneLoading = false;
    display();
  }
};

window.addEventListener("scroll", scrollHandler);

const display = async (search) => {
  if (list.length === 0) {
    list = await getObjectList(search);
  }
  if (list.length === 0) {
    error.hidden = false;
  }
  if (listCounter >= list.length) {
    return;
  } else {
    error.hidden = true;
    const end =
      listCounter + 30 >= list.length ? list.length : listCounter + 30;
    displayPhotos(list.objectIDs.slice(listCounter, end));
    listCounter += 30;
    if (listCounter >= list.length) {
    }
  }
};

searchButton.addEventListener("click", (el) => {
  el.preventDefault();
  list = [];
  listCounter = 0;
  imageContainer.innerHTML = "";
  console.log(searchInput.value);
  display(searchInput.value);
});

display("sunflower");
