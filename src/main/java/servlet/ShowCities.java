package servlet;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import service.CityUtils;
import bean.City;

/**
 * Servlet that uses MVC to send city info in XML, JSON, and text formats.
 */
@WebServlet("/show-cities")
public class ShowCities extends HttpServlet {
	private CityUtils util = new CityUtils();

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		String cityType = request.getParameter("cityType");
		List<City> cities = util.findCities(cityType);
		request.setAttribute("cities", cities);
		String format = request.getParameter("format");
		String outputPage;
		if ("xml".equals(format)) {
			response.setContentType("text/xml");
			outputPage = "/WEB-INF/results/cities-xml.jsp";
		} else if ("json".equals(format)) {
			response.setContentType("application/json");
			outputPage = "/WEB-INF/results/cities-json.jsp";
		} else {
			response.setContentType("text/plain");
			outputPage = "/WEB-INF/results/cities-string.jsp";
		}
		RequestDispatcher dispatcher = request.getRequestDispatcher(outputPage);
		dispatcher.include(request, response);
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
