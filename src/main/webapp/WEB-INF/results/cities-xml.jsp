<?xml version="1.0" encoding="UTF-8"?>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<cities>
  <headings>
    <heading>City</heading>
    <heading>Time</heading>
    <heading>Population</heading>
  </headings>
  <c:forEach var="city" items="${cities}">
	  <city>
	    <name>${city.name}</name>
	    <time>${city.time}</time>
	    <population>${city.population}</population>
	  </city>
  </c:forEach>
</cities>