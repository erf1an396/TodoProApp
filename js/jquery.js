$(document).ready(function() {
    const themeSwitcherBtn = $("#theme-switcher");
    const bodyTag = $("body");
    const addBtn = $("#add-btn");
    const todoInput = $("#addt");
    const ul = $(".todos");
    const filter = $(".filter");
    const btnFilter = $("#clear-completed");

    const main = function() {
        themeSwitcherBtn.on("click", function() {
            bodyTag.toggleClass("light");
            const themeImg = themeSwitcherBtn.children("img");
            themeImg.attr("src", themeImg.attr("src") === "./assets/images/icon-sun.svg" ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg");
        });

        makeTodoElement(JSON.parse(localStorage.getItem("todos")));

        ul.on('dragover', function(e) {
            e.preventDefault();
            const target = $(e.target).closest(".card");
            if (target.length && !target.hasClass("dragging")) {
                const draggingCard = $(".dragging");
                const cards = $(".todos .card").toArray();
                const currentPos = cards.indexOf(draggingCard[0]);
                const newPos = cards.indexOf(target[0]);
                if (currentPos > newPos) {
                    target.before(draggingCard);
                } else {
                    target.after(draggingCard);
                }
                const todos = JSON.parse(localStorage.getItem("todos"));
                const removed = todos.splice(currentPos, 1);
                todos.splice(newPos, 0, removed[0]);
                localStorage.setItem("todos", JSON.stringify(todos));
            }
        });

        addBtn.on("click", function() {
            const item = todoInput.val().trim();
            if (item) {
                todoInput.val("");
                const todos = JSON.parse(localStorage.getItem("todos")) || [];
                const currentTodo = { item: item, isCompleted: false };
                todos.push(currentTodo);
                localStorage.setItem("todos", JSON.stringify(todos));
                makeTodoElement([currentTodo]);
            }
        });

        todoInput.on('keydown', function(e) {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });

        filter.on('click', function(e) {
            const id = $(e.target).attr("id");
            if (id) {
                $(".on").removeClass("on");
                $("#" + id).addClass("on");
                $(".todos").attr("class", "todos " + id);
            }
        });

        btnFilter.on('click', function() {
            const deleteIndexes = [];
            $(".card.checked").each(function() {
                const card = $(this);
                deleteIndexes.push($(".todos .card").index(card));
                card.addClass("fall").on('animationend', function() {
                    card.remove();
                });
            });
            removeMultipleTodos(deleteIndexes);
        });
    };

    const removeTodo = function(index) {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const removeMultipleTodos = function(indexes) {
        let todos = JSON.parse(localStorage.getItem("todos"));
        todos = todos.filter((todo, index) => !indexes.includes(index));
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const stateTodo = function(index, isComplete) {
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos[index].isCompleted = isComplete;
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const makeTodoElement = function(todoArray) {
        if (!todoArray) {
            return null;
        }
        const ItemsLeft = $('#items-left');

        todoArray.forEach((todoObject) => {
            const card = $("<li>").addClass("card").attr("draggable", true);
            const cbContainer = $("<div>").addClass("cb-container");
            const cbInput = $("<input>").addClass("cb-input").attr("type", "checkbox");
            const checkSpan = $("<span>").addClass("check");
            const item = $("<p>").addClass("item").text(todoObject.item);
            const clearBtn = $("<button>").addClass("clear").html($("<img>").attr("src", "./assets/images/icon-cross.svg").attr("alt", "Clear It"));

            if (todoObject.isCompleted) {
                card.addClass('checked');
                cbInput.attr('checked', 'checked');
            }

            card.on('dragstart', function() {
                $(this).addClass("dragging");
            });

            card.on('dragend', function() {
                $(this).removeClass("dragging");
            });

            cbInput.on('click', function() {
                const currentCard = $(this).closest(".card");
                const checked = $(this).is(":checked");
                const currentCardIndex = $(".todos .card").index(currentCard);
                stateTodo(currentCardIndex, checked);

                checked ? currentCard.addClass('checked') : currentCard.removeClass('checked');

                ItemsLeft.text($(".todos .card:not(.checked)").length);
            });

            clearBtn.on('click', function() {
                const currentCard = $(this).closest(".card");
                currentCard.addClass('fall');
                const indexOfCurrentCard = $(".todos .card").index(currentCard);
                removeTodo(indexOfCurrentCard);
                currentCard.on('animationend', function() {
                    setTimeout(function() {
                        currentCard.remove();
                        ItemsLeft.text($(".todos .card:not(.checked)").length);
                    }, 100);
                });
            });

            cbContainer.append(cbInput).append(checkSpan);
            card.append(cbContainer).append(item).append(clearBtn);

            $(".todos").append(card);
        });

        ItemsLeft.text($(".todos .card:not(.checked)").length);
    };

    main();
});
