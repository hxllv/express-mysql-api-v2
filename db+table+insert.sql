create database express_sql_api_v2;

use express_sql_api_v2;

create table item_types (
	id_item_types int auto_increment primary key,
    type_name varchar(255)
);

create table items (
	id_items int auto_increment primary key,
    title varchar(255) not null,
    description varchar(255) not null,
    id_item_types int not null,
    foreign key (id_type) references item_types(id_type)
);

create table imgs (
	id_imgs int auto_increment primary key,
    img varchar(255) not null,
    id_items int not null,
    foreign key (id_item) references items(id_item)
);

insert into item_types values (1, "Cups");
insert into item_types values (2, "Plates");
insert into item_types values (3, "Spoons");

insert into items values (1, "Green cup", "This is a green cup", 1);
insert into items values (2, "Red cup", "This is a red cup", 1);
insert into items values (3, "Rainbow cup", "This is a rainbow cup", 1);

insert into items values (4, "Porcelain plate", "This is a porcelain plate", 2);
insert into items values (5, "Plastic plate", "This is a plastic plate", 2);
insert into items values (6, "Glass plate", "This is a glass plate", 2);

insert into items values (7, "Plastic spoon", "This is a plastic spoon", 3);
insert into items values (8, "Stainless-steel spoon", "This is a stainless-steel spoon", 3);
insert into items values (9, "Wooden spoon", "This is a wooden spoon", 3);

insert into imgs values (1, "Image for green cup", 1);
insert into imgs values (2, "Image for red cup", 2);
insert into imgs values (3, "Image for rainbow cup", 3);

insert into imgs values (4, "Image for porcelain plate", 4);
insert into imgs values (5, "Image for plastic plate", 5);
insert into imgs values (6, "Image for glass plate", 6);

insert into imgs values (7, "Image for plastic spoon", 7);
insert into imgs values (8, "Image for stainless-steel spoon", 8);
insert into imgs values (9, "Image for wooden spoon", 9);
