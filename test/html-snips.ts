export const assoc_info_html = `<html><div class="desc-container-table">
<table>
    <tr>
        <th>Team Name</th>
        <td>Alaska All Stars</td>
        <th>Ranking</th>
      <td>
            <ul>
               <li><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></li>
          </ul>
       </td>
    </tr>
    <tr>
        <th>Location</th>
        <td>Anchorage, AK</td>

        <th>President</th>
        <td id="assoc-president"><a href="contact_request.php?o=a&a=a&n=352&p=1"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>Website</th>
        
        <td id="assoc-web"><a href="https://www.hometeamsonline.com/teams/1?u=alaskaallstars&amp;s=hockey" title="https://www.hometeamsonline.com/teams/?u=alaskaallstars&amp;s=hockey" target="_blank">https://www.hometeamsonline.com/teams/?u=alaskaallstars&s=hockey</a> <a href="website_request.php?o=a&n=352"><img class="info-add-button" alt="Edit association Website" title="Edit Association Website" src="/images/curved-arrow-yellow-right.png"></a></td>
        <th>Hockey Director</th>
        <td id="assoc-director"><a href="contact_request.php?o=a&a=a&n=352&p=4"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>League(s)</th>
        <td><a href="/league_info.php?l=134">ASHA</a>        </td>
        <th>Year Founded</th>
        <td id="est-date"><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></td>
    </tr>
    <tr>
        <th>Status</th>
        <td>Active</td>
        <th>Social Media</th>
        <td id="social-media">
<form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form>        </td> 
    </tr>
    <tr>
        <th>Rinks</th>
        <td colspan="3">
            <ul>
                <li><a href='/rink_info.php?r=112'>Dempsey Anderson Ice Arenas</a> (Anchorage, AK) </li>
            </ul>
        </td>
    </tr>
</table>
</div></html>`;

export const html_rows_with_ads = `
<!DOCTYPE html>
<html lang = "en">
<head>
<div class="profile-upd-del">
<a class='add_req_link' href='change_requests.php?o=a' title='Request To Add Missing Association'></a></div>
<h4 class=sitestyle6>Youth Association Directory</h4>

<div id = "association_directory" class = "tablecontainer"><div class = "tableheads"> <form method="post" action="associations.php">
<p><SPAN class=sitestyle9 style='color:#ffffff;'>Tier 1 Only: <input type="checkbox" name="t" value=1>

					&nbsp; &nbsp; &nbsp;
					State: <select name="s" size="1">
					    <option value="" selected>All States Included
    <option value=AL>Alabama
    <option value=AK>Alaska
    <option value=AZ>Arizona
    <option value=SK>Saskatchewan
    <option value=YT>Yukon Territory
    <option value=XX>Other
</select>

&nbsp; &nbsp; &nbsp; <input type="submit" name="submit" value="UPDATE">
</span></p></form>
</div> <!--end table head --><div class ="tableheads targ"></div> <!--end table head 2 --><div id="scrollholder" class="scrollholder"><table width=100% class = 'linked_table' border="1" cellpadding="2" cellspacing="0">
  <thead>
  <tr>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">Name</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">City</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">State</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">League(s)</font></td>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><SPAN class=sitestyle4><a href="association_info.php?a=352">Alaska All Stars</a></span></td>
    <td><SPAN class=sitestyle4>Anchorage</span></td>
    <td><SPAN class=sitestyle4>AK</span></td>
    <td><SPAN class=sitestyle4> <a href="league_info.php?l=134">ASHA</a>    </SPAN></td></tr>  <tr>
    <td><SPAN class=sitestyle4><a href="association_info.php?a=551">Alaska Grizzlies</a></span></td>
    <td><SPAN class=sitestyle4>Fairbanks</span></td>
    <td><SPAN class=sitestyle4>AK</span></td>
    <td><SPAN class=sitestyle4> <a href="league_info.php?l=134">ASHA</a>    </SPAN></td></tr><tr class="mhr-ad-row">
    <td colspan="100">
<div class="in-context-ad"> 
      <script>
          (function () {
              MHRAds.show( 'in-context' );
         })()
    </script>
</div>
    </td>
</tr>
  <tr>
    <td><SPAN class=sitestyle4><a href="association_info.php?a=544">Fairbanks Arctic Lions</a></span></td>
    <td><SPAN class=sitestyle4>Fairbanks</span></td>
    <td><SPAN class=sitestyle4>AK</span></td>
    <td><SPAN class=sitestyle4> <a href="league_info.php?l=134">ASHA</a>    </SPAN></td></tr>
</tbody>
</table>

</div> <!--end scrolls-->


</div> <!--end table container -->               <div class="col-cont" id="main-columns"></div> 
            </main>
            </div>

`;

export const assoc_no_rink_html = `<html><div class="desc-container-table">
<table>
    <tr>
        <th>Team Name</th>
        <td>Alaska All Stars</td>
        <th>Ranking</th>
      <td>
            <ul>
               <li><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></li>
          </ul>
       </td>
    </tr>
    <tr>
        <th>Location</th>
        <td>Anchorage, AK</td>

        <th>President</th>
        <td id="assoc-president"><a href="contact_request.php?o=a&a=a&n=352&p=1"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>Website</th>
        <td id="assoc-web"><a href="https://www.hometeamsonline.com/teams/?u=alaskaallstars&amp;s=hockey" title="https://www.hometeamsonline.com/teams/?u=alaskaallstars&amp;s=hockey" target="_blank">https://www.hometeamsonline.com/teams/?u=alaskaallstars&s=hockey</a> <a href="website_request.php?o=a&n=352"><img class="info-add-button" alt="Edit association Website" title="Edit Association Website" src="/images/curved-arrow-yellow-right.png"></a></td>
        <th>Hockey Director</th>
        <td id="assoc-director"><a href="contact_request.php?o=a&a=a&n=352&p=4"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>League(s)</th>
        <td><a href="/league_info.php?l=134">ASHA</a>        </td>
        <th>Year Founded</th>
        <td id="est-date"><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></td>
    </tr>
    <tr>
        <th>Status</th>
        <td>Active</td>
        <th>Social Media</th>
        <td id="social-media">
<form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form>        </td> 
    </tr>
    <tr>
        <th>Rinks</th>
        <td colspan="3">
            <ul>
            </ul>
        </td>
    </tr>
</table>
</div></html>`;

export const assoc_no_web_html = `<html><div class="desc-container-table">
<table>
    <tr>
        <th>Team Name</th>
        <td>Alaska All Stars</td>
        <th>Ranking</th>
      <td>
            <ul>
               <li><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></li>
          </ul>
       </td>
    </tr>
    <tr>
        <th>Location</th>
        <td>Anchorage, AK</td>

        <th>President</th>
        <td id="assoc-president"><a href="contact_request.php?o=a&a=a&n=352&p=1"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>Website</th>
        <td id="assoc-web"><a title="https://www.hometeamsonline.com/teams/?u=alaskaallstars&amp;s=hockey" target="_blank">https://www.hometeamsonline.com/teams/?u=alaskaallstars&s=hockey</a> <a href="website_request.php?o=a&n=352"><img class="info-add-button" alt="Edit association Website" title="Edit Association Website" src="/images/curved-arrow-yellow-right.png"></a></td>
        <th>Hockey Director</th>
        <td id="assoc-director"><a href="contact_request.php?o=a&a=a&n=352&p=4"><img class="info-add-button" alt="Add association Contact" title="Add Team Contact" src="/images/curved-arrow-green-right.png"></a></td>
    </tr>
    <tr>
        <th>League(s)</th>
        <td><a href="/league_info.php?l=134">NHL</a>        </td>
        <th>Year Founded</th>
        <td id="est-date"><form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form></td>
    </tr>
    <tr>
        <th>Status</th>
        <td>Active</td>
        <th>Social Media</th>
        <td id="social-media">
<form method="GET" action="/member_benefits.php"><input type="image" class="info-add-button" src="/images/plus-sign.png"></form>        </td> 
    </tr>
    <tr>
        <th>Rinks</th>
        <td colspan="3">
            <ul>
                <li><a href='/rink_info.php?r=1'>Boys and Girls Club of Pittsfield</a></li>
            </ul>
        </td>
    </tr>
</table>
</div>
<a href="/testing">Tests are nice</a>
</html>`;

export const html_one_row = `
<!DOCTYPE html>
<html lang = "en">
<head>
<div class="profile-upd-del">
<a class='add_req_link' href='change_requests.php?o=a' title='Request To Add Missing Association'></a></div>
<h4 class=sitestyle6>Youth Association Directory</h4>

<div id = "association_directory" class = "tablecontainer">
<div class ="tableheads targ"></div> <!--end table head 2 --><div id="scrollholder" class="scrollholder"><table width=100% class = 'linked_table' border="1" cellpadding="2" cellspacing="0">
  <thead>
  <tr>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">Name</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">City</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">State</font></td>
    <th bgcolor="#002c61"><font face="Arial" color="#FFFFFF">League(s)</font></td>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><SPAN class=sitestyle4><a href="test">Boston Bruins All Stars</a></span></td>
    <td><SPAN class=sitestyle4>Boston</span></td>
    <td><SPAN class=sitestyle4>MA</span></td>
    <td><SPAN class=sitestyle4> <a href="league_info.php?l=134">ASHA</a>    </SPAN></td></tr>
</tbody>
</table>

</div> <!--end scrolls-->


</div> <!--end table container -->               <div class="col-cont" id="main-columns"></div> 
            </main>
            </div>

`;

export const html_no_a = `
<!DOCTYPE html>
<html lang = "en">
<head>
<div class="profile-upd-del">
</head>
</html>
`