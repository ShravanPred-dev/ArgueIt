const OpenAI = require("openai-api");
const OPEN_AI_API_KEY = ############; // api key
const openai = new OpenAI(OPEN_AI_API_KEY);

window.onload = function () {
  const input = document.getElementById("input");
  input.addEventListener("click", () => {
    input.select();
  });

  // random topic button functionality
  const randomTopic = document.getElementById("random-topic");
  randomTopic.addEventListener("click", () => {
    handleRandomTopic();
  });
  function handleRandomTopic() {
    const topics = [
      "Philanthropy doesn't work",
      "Replacing human workers w/ automation is ethical",
      "Self-driving cars shouldn't be legal",
      "we should keep the death penalty",
      "universal basic income is an impractical concept",
    ];
    let topic = topics[Math.floor(Math.random() * topics.length)];
    topic == input.value ? handleRandomTopic() : (input.value = topic);
  }

  // modes
  const ideaModeButton = document.getElementById("idea-mode");
  const statModeButton = document.getElementById("stat-mode");
  const textModeButton = document.getElementById("text-mode");

  // search functionality
  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      window.handleSearch();
    }
  });

  window.handleSearch = function () {
    if (input.value && input.value.trim().length) {
      // check which mode is enabled
      if (ideaModeButton.classList.contains("selected")) {
        ideaMode();
      } else if (statModeButton.classList.contains("selected")) {
        statMode();
      } else if (textModeButton.classList.contains("selected")) {
        textMode();
      }
    }
  };
  const response = document.getElementById("response");

  // idea mode
  const ideaData = `
  Given an argument, give 3 different ideas that support the argument.
  
  Argument: we should keep the death penalty
  Ideas: The death penalty gives closure to the victim's families who have suffered so much. It creates another form of crime deterrent. It gives prosecutors another bargaining chip in the plea bargain process, which is essential in cutting costs in an overcrowded court system.

  Argument: universal basic income is an impractical concept
  Ideas: There won't be an increased standard of living in the long run because of inflated prices due to the increase in demand for goods and services. Free income may not incentivize people to get jobs, and could make work seem optional. Universal Basic Income (UBI) takes money from the poor and gives it to everyone, increasing poverty and depriving the poor of much needed targeted support.

  Argument: Philanthropy doesn't work
  Ideas: Philanthropy can't keep up with the money that's being taken from the economy. Philanthropy is usually about funding certain groups while excluding others. Philanthropies are often criticized for not being transparent enough or having a conflicts of interest

  Argument:`;

  function ideaMode() {
    response.innerHTML = `
    <div class='idea-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    <div class='idea-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    <div class='idea-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    `;
    response.scrollIntoView();

    // API request
    let newIdeaData = ideaData + " " + input.value + "\n";
    (async () => {
      const gptResponse = await openai.complete({
        engine: "davinci-instruct-beta",
        prompt: newIdeaData,
        maxTokens: 100,
        temperature: 0.7,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        stop: ["\n\n"],
      });

      let res = gptResponse.data.choices[0].text;
      // formatting outputs
      res = res.substr(8, res.length - 1);
      response.innerHTML = "";
      let ideas = res.split(".");
      // remove additional elements
      while (ideas.length > 3) {
        ideas.pop();
      }
      for (var i = 0; i < ideas.length; i++) {
        response.innerHTML +=
          "<div class='idea-card' onclick='copy(this.innerText)'><div class='idea'>" +
          ideas[i] +
          "</div></div>";
      }
    })();
  }

  // stat mode
  const statData = `
  Given an argument, provide a paragraph with ideas supported by statistics that support the claim.
  
  Argument: schools shouldn't give homework
  Statistics: A poll of high school students in California found that 59% thought they had too much homework; 82% of respondents said that they were “often or always stressed by schoolwork". Excessive homework leads to cheating: 90% of middle school students and 67% of high school students admit to copying someone else’s homework. Fourth grade students who did no homework got roughly the same score on the National Assessment of Educational Progress (NAEP) math exam as those who did 30 minutes of homework a night.

  Argument: All drugs should be legalized
  Statistics: Portugal has found that, since decriminalisation, both addiction and substance misuse rates have gone down because people with substance issues are treated rather than jailed. The Government could bring in tax revenue from a legalised drugs market; it was reported in June 2019 that the US state of Colorado had passed $1 billion in state revenue from cannabis sales since legalising it in in 2014. The 2014 defelonization victory in CA substantially reduced the number of people in prison and especially local jails; those savings are now being reallocated to provide needed services. 

  Argument: breakfast is the most important meal of the day
  Statistics: A German study published in The Journal of Clinical Endocrinology & Metabolism indicated that you can burn about twice as many calories per day if you eat breakfast because your body's absorption of carbohydrates, fats, and proteins might be faster in the morning. A study from the Cleveland Clinic showed that teenagers between ages 16 and 18 who ate breakfast before school got better grades than students who tended to skip breakfast. A study from the Journal of Strength & Conditioning found that skipping breakfast may hinder your progress in the gym especially when it comes to lifting weights.

  Argument:`;

  function statMode() {
    response.innerHTML = `
    <div class='stat-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    <div class='stat-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    <div class='stat-card animate-pulse'>
      <div class="w-28 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-40 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-20 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    `;
    response.scrollIntoView();

    // API request
    let newStatData = statData + " " + input.value + "\n";
    (async () => {
      const gptResponse = await openai.complete({
        engine: "davinci-instruct-beta",
        prompt: newStatData,
        maxTokens: 100,
        temperature: 0.7,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        stop: ["\n\n"],
      });

      let res = gptResponse.data.choices[0].text;
      // formatting outputs
      res = res.substr(13, res.length - 1);
      response.innerHTML = "";
      let stats = res.split(".");
      // remove additional elements
      while (stats.length > 3) {
        stats.pop();
      }
      for (var i = 0; i < stats.length; i++) {
        response.innerHTML +=
          "<div class='stat-card' onclick='copy(this.innerText)'><div class='stat'>" +
          stats[i] +
          "</div></div>";
      }
    })();
  }

  // text mode
  const textData = `
  Given an argument, give 3 different statistics that support the argument.
  
  Argument: Juveniles should tried as adults
  Text: The punishments and sentences that are meted out by juvenile courts are not usually appropriate to the kind of crime that has been committed (Cole and Smith 398). Moreover, the procedures used in waiving juvenile jurisdictions are usually problematic and cumbersome in many states in America. Criminal justice and law requires that any violent or heinous crimes committed by a person regardless of their age should be dealt with to the full extent of the law.

  Argument: globalization is good
  Text: One positive impact of globalization on developing countries is an increase in standard of living. One of the aims of globalization of economies is to reduce poverty, and this aim is being achieved by the increased access to foreign funding from industrialized nations to developing countries. The spending of these funds on improving the education, health, social, and transport infrastructure of the developing nations consequently aids in improving the standard of living of the people.
  
  Argument:`;

  function textMode() {
    response.innerHTML = `
    <div class='text-card animate-pulse'>
      <div class="w-44 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-56 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-36 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-64 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
      <div class="w-52 h-4 bg-gray-400 rounded ml-6 mt-7"></div>
    </div>
    `;
    response.scrollIntoView();

    // API request
    let newTextData = textData + " " + input.value + "\n";
    (async () => {
      const gptResponse = await openai.complete({
        engine: "davinci-instruct-beta",
        prompt: newTextData,
        maxTokens: 100,
        temperature: 0.7,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        stop: ["\n\n"],
      });

      let res = gptResponse.data.choices[0].text;
      res = res.substr(7, res.length - 1);
      console.log(res);
      response.innerHTML = "";
      response.innerHTML =
        "<div class='text-card' onclick='copy(this.innerText)'><div class='text'>" +
        res +
        "</div></div>";
    })();
  }
};
