// 青禾主题词库原创例句的学习型英文翻译。与每组 words 顺序一一对应，便于独立审校。
const themedExampleTranslations={
  'colors':[
    'I like red clothes.','The sky is blue.','This leaf is green.','She bought a yellow umbrella.','There is a white cup on the table.','His schoolbag is black.','Many pink flowers bloom in spring.','I want to try on that purple coat.','On cloudy days, the sky is often gray.','She drew a sun with an orange pen.'
  ],
  'animals':[
    'That cat is sleeping.','This dog really likes playing with people.','Pandas like eating bamboo.','There are two birds in the tree.','There are many fish in the water.','There is a horse on the grass.','This rabbit has long ears.','An elephant has a long trunk.','The lion at the zoo is resting.','Dolphins are intelligent marine animals.'
  ],
  'plants':[
    'There is a bouquet of flowers on the table.','There is a big tree at the school entrance.','The grass is very green after the rain.','A lot of bamboo is planted in the yard.','He gave his mother a rose.','Lotuses bloom in the pond in summer.','Many pine trees grow on the mountain.','In autumn, the leaves slowly turn yellow.','In spring, we plant the seeds in the soil.','Many animals live in this forest.'
  ],
  'food':[
    'I want to eat rice for lunch.','The noodles at this restaurant are delicious.','We make dumplings together during the Spring Festival.','I eat an apple every day.','There are eggs and milk for breakfast.','The child drinks milk every morning.','Eating more vegetables is good for your health.','There is a lot of fresh fruit on the table.','This dish contains tofu and green vegetables.','When the weather is cold, I like drinking hot soup.'
  ],
  'transport':[
    'I take the subway to work every day.','The bus will arrive soon.','We are taking the train to Shanghai.','The plane takes off at three in the afternoon.','It is raining, so let us take a taxi.','He rides a bicycle to school.','It is very convenient to travel to Beijing by high-speed rail.','We took a boat to the island.','The next stop is the city center.','To get to the airport, you need to transfer to the subway here.'
  ],
  'weather':[
    'Tomorrow will be sunny, so it is a good day to go out.','It is cloudy today, and the sun cannot be seen.','It is raining outside; do not forget to bring an umbrella.','It often snows here in winter.','It is windy outside and a little cold.','It is too hot today.','It will be very cold tonight, so wear a little more.','Today’s highest temperature is 28 degrees.','The weather forecast says it will be cloudy tomorrow.','The humidity here is relatively high in summer.'
  ],
  'family':[
    'My father likes running in the morning.','Mom is cooking in the kitchen.','My parents live in the south.','My older brother is three years older than I am.','My older sister studies Chinese at university.','My younger brother is ten years old this year.','My younger sister is drawing a kitten.','The children are playing in the park.','She and her husband cook together on weekends.','His wife is a doctor.'
  ],
  'body':[
    'His head hurts a little.','Her eyes are beautiful.','A rabbit has long ears.','My nose turns red when the weather is cold.','Please open your mouth and speak slowly.','Wash your hands before eating.','I walked too much today, so my feet are a little tired.','Exercise is good for heart health.','My backpack is too heavy, and my shoulders hurt a little.','Drinking coffee on an empty stomach may feel uncomfortable.'
  ],
  'clothing':[
    'He is wearing a white shirt today.','These pants are a little long.','She bought a blue dress.','It is cold outside, so remember to wear a coat.','These shoes are comfortable to walk in.','The sun is strong, so put on a hat.','I need to buy two new pairs of socks.','My grandmother gave me this scarf.','Wear gloves when you go out on a snowy day.','Excuse me, do you have this in a larger size?'
  ],
  'jobs':[
    'Teacher Wang teaches us Chinese.','The doctor advised me to get more rest.','The taxi driver knows this city very well.','This chef is especially good at cooking Sichuan food.','The reporter is interviewing the athlete.','My older sister is a software engineer.','They asked a lawyer to help deal with this issue.','The waiter brought us the menu.','The nurse took the patient’s temperature.','This designer likes a simple style.'
  ],
  'emotions':[
    'I am very happy to see an old friend.','She felt a little sad when she heard the news.','Do not be angry; we can discuss it calmly.','I was very nervous the first time I spoke on stage.','The child is a little afraid of the dark.','Do not worry; I will finish it on time.','Although the result was not ideal, do not be too disappointed.','Everyone is excited about traveling tomorrow.','Listening to music helps me gradually relax.','Everyone is very satisfied with this event.'
  ],
  'common-verbs':[
    'Let us go and have lunch together.','Drink plenty of water after exercising.','Let us go watch a movie this weekend.','I listen to Chinese news every day.','Please speak a little more slowly; I am still learning.','She is writing an email.','I am going to buy groceries after work.','Thank you for helping me practice Chinese.','You can choose a course that suits you.','We decided to go hiking this weekend.'
  ],
  'home':[
    'We are chatting in the living room.','My bedroom is not large, but it is very quiet.','Dad is preparing dinner in the kitchen.','Several pots of flowers are growing on the balcony.','The package has already been left at the door.','There is a convenience store downstairs.','The new neighbor is very friendly.','The colors of this furniture set feel warm.','I left my keys at the office.','Please confirm the delivery address again.'
  ],
  'chores':[
    'We clean the room together on Saturday morning.','Please organize the documents on the table first.','I usually do the laundry in the evening.','Wait until the rain stops before hanging the clothes on the balcony.','I like cooking for myself after work.','I will cook today, and you can wash the dishes.','Do not forget to take out the trash when you leave.','The repair technician will come to fix the washing machine tomorrow.','We will set off after we finish packing.','She is moving house next month.'
  ],
  'personality':[
    'She is very conscientious when she studies.','The local people warmly welcomed us.','The new student is friendly to everyone.','The teacher patiently explained it three times.','Honesty is a very important quality.','She bravely expressed her own opinion.','He is cheerful and makes friends easily.','She is rather quiet, but she likes helping others.','His speech is very humorous.','Studying abroad has made me more independent.'
  ],
  'relationships':[
    'My classmates and I are preparing for the exam together.','The new coworker reported to the company today.','A friend invited me to her home for dinner.','Two guests came to our home.','My roommate gets up very early every day.','Study partners can encourage each other.','Please contact me after you arrive in Beijing.','We get along very well.','Cooperation requires mutual trust.','They plan to get married next year.'
  ],
  'travel':[
    'Please check whether your passport is valid before traveling abroad.','I am applying for a tourist visa online.','Can this piece of luggage be taken onto the plane?','We booked a hotel near the station.','This city has many historical attractions.','Let us check the route on the map first.','It is best to book train tickets in advance.','We are leaving at seven tomorrow morning.','The train will arrive in Nanjing in the afternoon.','If you get lost, you can ask a staff member.'
  ],
  'shopping':[
    'The prices at these two stores are about the same.','This store will offer discounts on the weekend.','You can pay with your phone.','This small shop only accepts cash.','I do not have small change; can I scan to pay?','Please keep the invoice after making payment.','Goods can only be returned if they have not been used.','May I try on this dress?','Buying tickets online may be cheaper.','The coffee here is a little expensive.'
  ],
  'public-services':[
    'The bank is closed on weekend afternoons.','After losing an identity document, you can consult the local police station.','To get a library card, go to the library’s front desk.','The museum is closed every Monday.','Please submit the documents at the community service office.','Please complete the formalities at window number three.','After taking a number, please line up and wait.','Students can apply for this service online.','Please bring a valid identity document such as your passport.','These formalities take about ten minutes.'
  ],
  'school':[
    'The campus is beautiful in autumn.','The students have already entered the classroom.','My dormitory is close to the canteen.','The school canteen is very crowded at noon.','Let us go running on the sports field after class.','Please open the textbook to page five.','Today’s homework is not very difficult.','We have a listening test next week.','Her exam results are improving quickly.','I chose five courses this semester.'
  ],
  'study-skills':[
    'I review the day’s new words every evening.','Preview the text before class.','Learn to take notes while listening in class.','Let us go to the library to look up information.','Only with more practice can you speak more naturally.','I understand the meaning of this sentence now.','Please remember the tone of this word.','Summarize what you learned promptly after each lesson.','You can ask questions about anything you do not understand.','The group is discussing the study plan.'
  ],
  'workplace':[
    'She works at a technology company.','The manager is not in the office right now.','The afternoon meeting starts at two.','This project requires cooperation among three departments.','We completed the task on time.','Read the contract carefully before signing it.','We are going to meet the client tomorrow.','I do not need to work overtime this week.','If you feel unwell, take leave and rest.','Salaries are paid on the fifth of every month.'
  ],
  'medical':[
    'I seem to have a cold and my nose keeps running.','The child had a slight fever last night.','If you keep coughing, see a doctor promptly.','I slept too little and now I have a headache.','Register on the first floor before seeing a doctor.','The doctor advised me to have further tests.','This medicine should be taken after meals.','Please take the medicine according to the instructions on the prescription.','After resting, he recovered very well.','Everyone can learn some basic first-aid skills.'
  ],
  'exercise':[
    'I run three times a week.','Many people like swimming in summer.','I ride my bicycle to work when the weather is good.','He goes to work out after work.','This football match is very exciting.','Athletes need to train every day.','The team is doing physical training.','The children are playing basketball on the court.','Doing yoga can help the body relax.','Let us take a walk by the river after dinner.'
  ],
  'environment':[
    'The air is fresh after the rain.','Reducing pollution requires everyone’s effort.','This city is promoting waste sorting.','Please conserve water and electricity.','Old cardboard boxes can be sorted for recycling.','Solar power is a clean energy source.','Water is an important natural resource.','The climate here is mild and humid.','We should protect wild animals.','A quiet environment is better for studying.'
  ],
  'technology':[
    'My computer needs to restart.','Please put your phone on silent during class.','This learning software can be used offline.','The engineer is testing a new program.','The internet connection here is not very stable.','Please do not tell anyone your password.','You can download the course materials first.','Please upload your homework to the system.','The app became easier to use after the update.','Artificial intelligence is changing the way people learn.'
  ],
  'science':[
    'The students completed the experiment according to the steps.','This team is studying air quality.','We need to check these data first.','This method is simple and effective.','The experimental results match our prediction.','The researchers discovered a new change.','More evidence is needed to prove this view.','A theory needs to be tested through practice.','Humans have always been exploring the universe.','This satellite can observe changes in the weather.'
  ],
  'law-safety':[
    'Everyone should obey the law.','Please read the rules before taking part in the event.','Consumers have the right to know product information.','Protecting personal information is the platform’s responsibility.','Always pay attention to safety when crossing the road.','Please stay away from dangerous areas.','In an emergency, you can call the police immediately.','The police officer is helping a lost child.','Cybercrime is also punished by law.','Please keep the payment record as evidence.'
  ],
  'culture-media':[
    'Learning a language also helps you understand the local culture.','This city has a long history.','The Spring Festival has many traditional customs.','She is very interested in traditional Chinese art.','This movie has Chinese and English subtitles.','Music makes the evening more relaxing.','I listen to Chinese news for ten minutes every day.','Language keeps changing along with society.','This passage introduces a writer.','This program is about the lives of ordinary people.'
  ],
  'leisure':[
    'My hobbies are photography and travel.','He often goes out to take photographs on weekends.','The child is sitting by the window and drawing.','The friends sing together to celebrate a birthday.','She has liked dancing since she was little.','Reading every day helps you build vocabulary.','This game requires two people to cooperate.','When the weather is good, we have a picnic in the park.','For your first camping trip, prepare enough water.','Take a break after studying for forty minutes.'
  ],
  'engineering':[
    'This material is light and strong.','This table uses recycled wood.','The main structure of the bridge is made of steel.','Cement needs time to harden completely.','This building combines traditional and modern design.','The engineer is inspecting the structure of the house.','You must receive training before using the equipment.','This engineering project is expected to be completed next year.','The land must be measured accurately before construction.','Construction is in progress ahead; please slow down.'
  ],
  'finance':[
    'She keeps a record of her monthly income.','Rent is my largest living expense.','It is best to make a budget before traveling.','Please do not give account information to strangers.','He saves part of his salary.','Understand the repayment terms before applying for a loan.','Deposit interest rates differ from bank to bank.','We bought travel insurance before departure.','Every investment carries some risk.','Market demand is changing.'
  ]
};

for(const deck of themedVocabularyDecks){
  const translations=themedExampleTranslations[deck.id]||[];
  deck.words.forEach((item,index)=>{
    item.exampleEn=translations[index]||'';
    const entry=words[item.word];
    if(entry){entry.examplesEn=[item.exampleEn];entry.exampleEn=item.exampleEn;}
  });
}
